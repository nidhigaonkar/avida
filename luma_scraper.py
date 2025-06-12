#!/usr/bin/env python3
"""
Simplified Luma Event Scraper for Two People
Finds in-person events that match both people's interests and profiles
"""

import json
import os
import time
import platform
from typing import Dict, List, Any
from dataclasses import dataclass
from bs4 import BeautifulSoup
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.os_manager import ChromeType
from dotenv import load_dotenv


@dataclass
class Person:
    name: str
    age: int
    location: str
    company: str
    interests: List[str]
    
    @classmethod
    def from_json(cls, json_data: Dict[str, Any]) -> 'Person':
        return cls(**json_data)

class LumaEventScraper:
    def __init__(self):
        # Set up Chrome options
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        # Check if running on Mac ARM64
        is_mac_arm = platform.system() == 'Darwin' and platform.machine() == 'arm64'
        chrome_version = "137.0.7151.104"  # Update this if your Chrome version changes
        try:
            if is_mac_arm:
                # For Mac ARM64, use the specific ChromeDriver and version
                service = Service(ChromeDriverManager(driver_version=chrome_version, chrome_type=ChromeType.CHROMIUM).install())
            else:
                # For other platforms, use the default ChromeDriver and version
                service = Service(ChromeDriverManager(driver_version=chrome_version).install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.base_url = "https://lu.ma/sf"
            print("Chrome driver initialized successfully")
        except Exception as e:
            print(f"Error initializing Chrome driver: {str(e)}")
            raise
    
    def __del__(self):
        """Clean up the driver when the object is destroyed"""
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def load_people_profiles(self, person1_data: Dict, person2_data: Dict) -> tuple[Person, Person]:
        """Load two people's profiles from JSON data"""
        try:
            with open('intern1.json', 'r') as f1, open('intern2.json', 'r') as f2:
                person1 = Person.from_json(json.load(f1))
                person2 = Person.from_json(json.load(f2))
            return person1, person2
        except Exception as e:
            print(f"Error loading intern profiles: {str(e)}")
            return Person.from_json(person1_data), Person.from_json(person2_data)
    
    def get_common_interests(self, person1: Person, person2: Person) -> List[str]:
        """Find common interests between two people"""
        interests1 = set(i.lower() for i in person1.interests)
        interests2 = set(i.lower() for i in person2.interests)
        return list(interests1.intersection(interests2))
    
    def get_all_interests(self, person1: Person, person2: Person) -> List[str]:
        """Get all unique interests from both people"""
        interests1 = set(i.lower() for i in person1.interests)
        interests2 = set(i.lower() for i in person2.interests)
        return list(interests1.union(interests2))
    
    def scrape_events(self, location: str) -> List[Dict]:
        """Scrape events from Luma using Selenium and BeautifulSoup"""
        try:
            print(f"\nScraping Luma events from {self.base_url}")
            self.driver.get(self.base_url)
            
            # Wait for initial page load
            time.sleep(5)
            
            # Find and click the "View All" button 
            try:
                view_all = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "//a[contains(text(), 'View All')]"))
                )
                print("Found View All button, clicking...")
                view_all.click()
                time.sleep(5)  # Wait for all events to load
            except Exception as e:
                print(f"Note: View All button not found or not clickable: {str(e)}")
            
            # Get the page source and parse with BeautifulSoup
            page_source = self.driver.page_source
            if not page_source:
                print("Error: Could not get page source")
                return []
                
            soup = BeautifulSoup(page_source, 'html.parser')
            
            print("\nDebug Information:")
            print("Page URL:", self.driver.current_url)
            print("Page Title:", soup.title.text if soup.title else "No title")
            
            events = []
            
            # Find all event content divs with the new class structure
            event_divs = soup.find_all('div', class_=lambda x: x and 'event-content' in str(x))
            print(f"\nFound {len(event_divs)} event divs")
            
            for div in event_divs:
                try:
                    # Get the event title from h3
                    title_elem = div.find('h3')
                    if not title_elem:
                        continue
                    title = title_elem.text.strip()
                    
                    # Get the event link
                    event_link = ""
                    link_elem = div.find_parent().find('a', class_=lambda x: x and ('event-link' in str(x) or 'content-link' in str(x)))
                    if link_elem:
                        href = link_elem.get('href', '')
                        event_link = f"https://lu.ma{href}" if href.startswith('/') else href
                    
                    # Get the event time
                    time_text = ""
                    time_div = div.find('div', class_='event-time')
                    if time_div:
                        time_span = time_div.find('span')
                        if time_span:
                            time_text = time_span.text.strip()
                    
                    # Get the location text (now using the SVG icon as a marker)
                    location_text = ""
                    location_divs = div.find_all('div', class_='attribute')
                    for loc_div in location_divs:
                        if loc_div.find('svg'):  # Location usually has an SVG icon
                            location_text = loc_div.find('div', class_='text-ellipses')
                            if location_text:
                                location_text = location_text.text.strip()
                                break
                    
                    # Get the organizers
                    organizers = ""
                    org_div = div.find('div', class_='text-ellipses nowrap')
                    if org_div:
                        organizers = org_div.text.strip()
                    
                    # Get the event status (e.g., "Near Capacity")
                    status = ""
                    status_div = div.find('div', class_='pill-label')
                    if status_div:
                        status = status_div.text.strip()
                    
                    # Get the attendee count
                    attendee_count = ""
                    count_div = div.find('div', class_='remaining-count')
                    if count_div:
                        attendee_count = count_div.text.strip()
                    
                    # Create the event object
                    event = {
                        'title': title,
                        'date': time_text,
                        'location': location_text or "San Francisco",
                        'organizers': organizers,
                        'status': status,
                        'attendees': attendee_count,
                        'link': event_link,
                        'description': f"Organized by {organizers}. {status} {attendee_count} attendees."
                    }
                    
                    events.append(event)
                    print(f"\nSuccessfully extracted event: {title}")
                    print(f"  Time: {time_text}")
                    print(f"  Location: {location_text}")
                    print(f"  Link: {event_link}")
                    print(f"  Organizers: {organizers}")
                    print(f"  Status: {status}")
                    print(f"  Attendees: {attendee_count}")
                    
                except Exception as e:
                    print(f"Error extracting event details: {str(e)}")
                    continue
            
            if not events:
                print("\nNo events found. Debug information:")
                # Try to find any elements with 'event' in their class name
                event_related = soup.find_all(class_=lambda x: x and 'event' in str(x).lower())
                print(f"Found {len(event_related)} elements with 'event' in class name")
                if event_related:
                    print("Sample classes:", [e.get('class', []) for e in event_related[:3]])
                
                # Print the first event-like structure we find
                first_event = soup.find('div', class_=lambda x: x and 'event-content' in str(x))
                if first_event:
                    print("\nFirst event-like structure found:")
                    print(first_event.prettify()[:500])
            else:
                print(f"\nSuccessfully processed {len(events)} events")
                
                # Save events to JSON file
                try:
                    with open('luma_events.json', 'w', encoding='utf-8') as f:
                        json.dump(events, f, indent=4, ensure_ascii=False)
                    print(f"\nSaved {len(events)} events to luma_events.json")
                except Exception as e:
                    print(f"Error saving events to JSON file: {str(e)}")
            
            return events
            
        except Exception as e:
            print(f"Error scraping events: {str(e)}")
            if hasattr(e, 'msg'):
                print(f"Selenium error message: {e.msg}")
            return []
    
    def find_matching_events(self, events: List[Dict], person1: Person, person2: Person) -> List[Dict]:
        """Find events that match both people's interests"""
        if not events:
            print("No events to process.")
            return []
            
        matching_events = []
        combined_interests = set(person1.interests + person2.interests)
        
        for event in events:
            event_text = f"{event['title']} {event['description']}".lower()
            matching_interests = [interest for interest in combined_interests if interest.lower() in event_text]
            
            if matching_interests:
                event['matching_interests'] = matching_interests
                matching_events.append(event)
        
        if not matching_events:
            print("No matching events found.")
        else:
            print(f"\nFound {len(matching_events)} matching events!")
            
        return matching_events

def main():
    # Load person profiles from JSON files
    try:
        with open('intern1.json', 'r') as f1, open('intern2.json', 'r') as f2:
            person1_data = json.load(f1)
            person2_data = json.load(f2)
    except FileNotFoundError:
        print("Error: Make sure both intern1.json and intern2.json exist in the current directory")
        return
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in one of the input files")
        return
    
    try:
        scraper = LumaEventScraper()
        person1, person2 = scraper.load_people_profiles(person1_data, person2_data)
        events = scraper.scrape_events(person1.location)
        matching_events = scraper.find_matching_events(events, person1, person2)
        
        if not matching_events:
            print("No matching events found.")
            return
            
        print(f"\nFound {len(matching_events)} events matching {person1_data['name']} and {person2_data['name']}'s interests:\n")
        
        for i, event in enumerate(matching_events, 1):
            print(f"Event {i}:")
            print(f"Title: {event['title']}")
            print(f"Date: {event['date']}")
            print(f"Location: {event['location']}")
            print(f"Matching Interests: {', '.join(event['matching_interests'])}")
            print(f"Link: {event['link']}")
            print()
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")
    finally:
        if 'scraper' in locals():
            del scraper  # This will trigger the __del__ method to clean up the driver

if __name__ == "__main__":
    main()