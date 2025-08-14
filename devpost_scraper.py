#!/usr/bin/env python3
"""
Devpost Hackathon Scraper
Scrapes hackathons from Devpost and filters for beginner-friendly ones
"""

import json
import time
from typing import Dict, List, Any
from dataclasses import dataclass
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import requests
from datetime import datetime
import re

@dataclass
class Hackathon:
    title: str
    url: str
    date: str
    prize: str
    description: str
    tags: List[str]
    is_beginner_friendly: bool
    location: str
    status: str

class DevpostScraper:
    def __init__(self):
        """Initialize the scraper with Chrome driver"""
        try:
            chrome_options = webdriver.ChromeOptions()
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
            
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            print("Chrome driver initialized successfully")
        except Exception as e:
            print(f"Error initializing Chrome driver: {str(e)}")
            raise
    
    def __del__(self):
        """Clean up the driver when the object is destroyed"""
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def is_beginner_friendly(self, title: str, description: str, tags: List[str]) -> bool:
        """Determine if a hackathon is beginner-friendly based on various indicators"""
        beginner_keywords = [
            'beginner', 'newbie', 'first time', 'starter', 'intro', 'learn',
            'student', 'education', 'bootcamp', 'workshop', 'tutorial',
            'getting started', 'new to', 'novice', 'entry level', 'basics'
        ]
        
        # Check title and description (case insensitive)
        text_to_check = f"{title} {description}".lower()
        for keyword in beginner_keywords:
            if keyword in text_to_check:
                return True
        
        # Check tags
        for tag in tags:
            if any(keyword in tag.lower() for keyword in beginner_keywords):
                return True
        
        # Check for student-specific hackathons
        student_indicators = ['student', 'university', 'college', 'school', 'campus']
        for indicator in student_indicators:
            if indicator in text_to_check:
                return True
        
        return False
    
    def scrape_hackathons(self) -> List[Dict[str, Any]]:
        """Scrape hackathons from Devpost"""
        base_url = "https://devpost.com/hackathons"
        print(f"\nScraping hackathons from {base_url}")
        
        try:
            self.driver.get(base_url)
            time.sleep(5)
            
            # Wait for the page to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".challenge-listing"))
            )
            
            # Scroll down to load more hackathons
            print("Scrolling to load more hackathons...")
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            scroll_attempts = 0
            max_scrolls = 5
            
            while scroll_attempts < max_scrolls:
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(3)
                
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height
                scroll_attempts += 1
            
            # Get page source and parse with BeautifulSoup
            page_source = self.driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')
            
            hackathons = []
            
            # Find hackathon cards
            hackathon_cards = soup.find_all('div', class_='challenge-listing')
            print(f"Found {len(hackathon_cards)} hackathon cards")
            
            for card in hackathon_cards:
                try:
                    # Extract title and URL
                    title_elem = card.find('h6') or card.find('h5') or card.find('a', class_='challenge-link-colorless')
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    
                    # Get hackathon URL
                    url = ""
                    link_elem = card.find('a', class_='challenge-link-colorless')
                    if link_elem:
                        href = link_elem.get('href', '')
                        url = f"https://devpost.com{href}" if href.startswith('/') else href
                    
                    # Extract date information
                    date = ""
                    date_elem = card.find('div', class_='challenge-meta') or card.find('time')
                    if date_elem:
                        date = date_elem.get_text(strip=True)
                    
                    # Extract prize information
                    prize = ""
                    prize_elem = card.find('div', string=re.compile(r'\$')) or card.find(text=re.compile(r'\$'))
                    if prize_elem:
                        if hasattr(prize_elem, 'parent'):
                            prize = prize_elem.parent.get_text(strip=True)
                        else:
                            prize = str(prize_elem).strip()
                    
                    # Extract description
                    description = ""
                    desc_elem = card.find('p') or card.find('div', class_='challenge-description')
                    if desc_elem:
                        description = desc_elem.get_text(strip=True)
                    
                    # Extract tags
                    tags = []
                    tag_elements = card.find_all('span', class_='challenge-tag') or card.find_all('div', class_='tag')
                    for tag_elem in tag_elements:
                        tag_text = tag_elem.get_text(strip=True)
                        if tag_text:
                            tags.append(tag_text)
                    
                    # Extract location (online/offline)
                    location = "Online"  # Default to online
                    location_indicators = card.find_all(text=re.compile(r'(online|virtual|remote|in-person|offline)', re.I))
                    if location_indicators:
                        location = location_indicators[0].strip()
                    
                    # Extract status (open, closed, upcoming)
                    status = "Unknown"
                    status_elem = card.find('div', class_='challenge-status') or card.find('span', class_='badge')
                    if status_elem:
                        status = status_elem.get_text(strip=True)
                    
                    # Check if submission date has passed
                    current_date = datetime.now()
                    if "submissions close" in date.lower():
                        status = "Open for submissions"
                    elif any(word in date.lower() for word in ['closed', 'ended', 'finished']):
                        status = "Closed"
                    
                    # Determine if beginner-friendly
                    is_beginner_friendly = self.is_beginner_friendly(title, description, tags)
                    
                    hackathon = {
                        'title': title,
                        'url': url,
                        'date': date,
                        'prize': prize,
                        'description': description,
                        'tags': tags,
                        'is_beginner_friendly': is_beginner_friendly,
                        'location': location,
                        'status': status
                    }
                    
                    hackathons.append(hackathon)
                    
                    print(f"\nExtracted hackathon: {title}")
                    print(f"  URL: {url}")
                    print(f"  Date: {date}")
                    print(f"  Prize: {prize}")
                    print(f"  Beginner Friendly: {is_beginner_friendly}")
                    print(f"  Status: {status}")
                    
                except Exception as e:
                    print(f"Error extracting hackathon details: {str(e)}")
                    continue
            
            print(f"\nSuccessfully scraped {len(hackathons)} hackathons")
            return hackathons
            
        except Exception as e:
            print(f"Error scraping hackathons: {str(e)}")
            return []
    
    def filter_beginner_friendly(self, hackathons: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Filter hackathons to show only beginner-friendly ones"""
        beginner_hackathons = [h for h in hackathons if h.get('is_beginner_friendly', False)]
        print(f"\nFound {len(beginner_hackathons)} beginner-friendly hackathons out of {len(hackathons)} total")
        return beginner_hackathons
    
    def filter_open_hackathons(self, hackathons: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Filter hackathons to show only currently open ones"""
        open_hackathons = [h for h in hackathons if 'closed' not in h.get('status', '').lower()]
        print(f"\nFound {len(open_hackathons)} open hackathons")
        return open_hackathons
    
    def save_to_json(self, hackathons: List[Dict[str, Any]], filename: str):
        """Save hackathons to a JSON file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(hackathons, f, indent=4, ensure_ascii=False)
            print(f"\nSaved {len(hackathons)} hackathons to {filename}")
        except Exception as e:
            print(f"Error saving to JSON file: {str(e)}")
    
    def print_summary(self, hackathons: List[Dict[str, Any]]):
        """Print a summary of the scraped hackathons"""
        if not hackathons:
            print("No hackathons found.")
            return
        
        print(f"\n{'='*60}")
        print(f"HACKATHON SUMMARY ({len(hackathons)} hackathons)")
        print(f"{'='*60}")
        
        for i, hackathon in enumerate(hackathons, 1):
            print(f"\n{i}. {hackathon['title']}")
            print(f"   URL: {hackathon['url']}")
            print(f"   Date: {hackathon['date']}")
            print(f"   Prize: {hackathon['prize']}")
            print(f"   Status: {hackathon['status']}")
            print(f"   Beginner Friendly: {'✓' if hackathon['is_beginner_friendly'] else '✗'}")
            print(f"   Tags: {', '.join(hackathon['tags'][:5])}")  # Show first 5 tags
            if hackathon['description']:
                desc = hackathon['description'][:100] + "..." if len(hackathon['description']) > 100 else hackathon['description']
                print(f"   Description: {desc}")

def main():
    """Main function to run the Devpost scraper"""
    try:
        scraper = DevpostScraper()
        
        print("Starting Devpost hackathon scraper...")
        hackathons = scraper.scrape_hackathons()
        
        if hackathons:
            # Save all hackathons
            scraper.save_to_json(hackathons, 'devpost_hackathons_all.json')
            
            # Filter and save beginner-friendly hackathons
            beginner_hackathons = scraper.filter_beginner_friendly(hackathons)
            scraper.save_to_json(beginner_hackathons, 'devpost_hackathons_beginner.json')
            
            # Filter and save open hackathons
            open_hackathons = scraper.filter_open_hackathons(hackathons)
            scraper.save_to_json(open_hackathons, 'devpost_hackathons_open.json')
            
            # Filter for beginner-friendly AND open hackathons
            beginner_open = [h for h in hackathons if h.get('is_beginner_friendly', False) and 'closed' not in h.get('status', '').lower()]
            scraper.save_to_json(beginner_open, 'devpost_hackathons_beginner_open.json')
            
            # Print summary
            print(f"\n{'='*60}")
            print("FILTERING RESULTS:")
            print(f"{'='*60}")
            print(f"Total hackathons: {len(hackathons)}")
            print(f"Beginner-friendly: {len(beginner_hackathons)}")
            print(f"Currently open: {len(open_hackathons)}")
            print(f"Beginner-friendly AND open: {len(beginner_open)}")
            
            # Print detailed summary of beginner-friendly hackathons
            if beginner_hackathons:
                print(f"\n{'='*60}")
                print("BEGINNER-FRIENDLY HACKATHONS:")
                print(f"{'='*60}")
                scraper.print_summary(beginner_hackathons)
        
        else:
            print("No hackathons were scraped. Please check the website structure or try again later.")
    
    except Exception as e:
        print(f"Error in main: {str(e)}")
    finally:
        if 'scraper' in locals():
            del scraper

if __name__ == "__main__":
    main()