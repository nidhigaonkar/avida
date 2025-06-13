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
        """Initialize the scraper with Chrome driver"""
        try:
            chrome_options = webdriver.ChromeOptions()
            chrome_options.add_argument('--headless')  # Run in headless mode
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            
            # Get Chrome version
            chrome_version = "137.0.7151.104"  # Using a known working version
            
            # Initialize the Chrome driver
            service = Service(ChromeDriverManager(driver_version=chrome_version).install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.city_urls = {
                'San Francisco': 'https://lu.ma/sf',
                'Los Angeles': 'https://lu.ma/la',
                'New York': 'https://lu.ma/nyc',
                'Toronto': 'https://lu.ma/toronto'
            }
            print("Chrome driver initialized successfully")
        except Exception as e:
            print(f"Error initializing Chrome driver: {str(e)}")
            raise
    
    def __del__(self):
        """Clean up the driver when the object is destroyed"""
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def get_city_from_location(self, location: str) -> str:
        """Extract city from location string"""
        location = location.lower().strip()
        
        # Comprehensive mapping of location variations
        city_mapping = {
            # San Francisco variations
            'san francisco': 'San Francisco',
            'sf': 'San Francisco',
            'san fran': 'San Francisco',
            'bay area': 'San Francisco',
            'silicon valley': 'San Francisco',
            'south san francisco': 'San Francisco',
            
            # Los Angeles variations
            'los angeles': 'Los Angeles',
            'la': 'Los Angeles',
            'l.a.': 'Los Angeles',
            'la county': 'Los Angeles',
            'los angeles county': 'Los Angeles',
            'hollywood': 'Los Angeles',
            'santa monica': 'Los Angeles',
            'venice': 'Los Angeles',
            'culver city': 'Los Angeles',
            
            # New York variations
            'new york': 'New York',
            'new york city': 'New York',
            'nyc': 'New York',
            'ny': 'New York',
            'manhattan': 'New York',
            'brooklyn': 'New York',
            'queens': 'New York',
            'bronx': 'New York',
            'staten island': 'New York',
            
            # Toronto variations
            'toronto': 'Toronto',
            'gta': 'Toronto',  # Greater Toronto Area
            'north york': 'Toronto',
            'scarborough': 'Toronto',
            'downtown toronto': 'Toronto',
            'york': 'Toronto',
            'east york': 'Toronto'
        }
        
        # First try exact match
        if location in city_mapping:
            return city_mapping[location]
        
        # Then try partial match
        for key, value in city_mapping.items():
            if key in location:
                return value
            
        # Try matching state/province abbreviations
        state_city_mapping = {
            'ca': ['San Francisco', 'Los Angeles'],  # Default to SF for CA
            'ny': 'New York',
            'on': 'Toronto',
            'ontario': 'Toronto'
        }
        
        # Extract potential state/province code
        parts = location.replace(',', ' ').split()
        for part in parts:
            part = part.lower().strip('.')
            if part in state_city_mapping:
                if isinstance(state_city_mapping[part], list):
                    # For CA, check if LA is mentioned, otherwise default to SF
                    return 'Los Angeles' if any(la_term in location for la_term in ['la', 'los']) else 'San Francisco'
                return state_city_mapping[part]
        
        print(f"Warning: Could not definitively map location '{location}' to a city, defaulting to San Francisco")
        return 'San Francisco'  # Default to SF if no match found

    def scrape_events_for_location(self, location: str) -> List[Dict]:
        """Scrape events for a specific location"""
        city = self.get_city_from_location(location)
        if city not in self.city_urls:
            print(f"Warning: No direct URL for {city}, defaulting to San Francisco")
            city = 'San Francisco'
        
        base_url = self.city_urls[city]
        print(f"\nScraping Luma events from {base_url} for {city}")
        
        try:
            self.driver.get(base_url)
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
            print(f"\nFound {len(event_divs)} event divs in {city}")
            
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
                        'location': location_text or city,
                        'organizers': organizers,
                        'status': status,
                        'attendees': attendee_count,
                        'link': event_link,
                        'description': f"Organized by {organizers}. {status} {attendee_count} attendees.",
                        'city': city
                    }
                    
                    events.append(event)
                    print(f"\nSuccessfully extracted event: {title}")
                    print(f"  Time: {time_text}")
                    print(f"  Location: {location_text}")
                    print(f"  Link: {event_link}")
                    print(f"  City: {city}")
                    print(f"  Organizers: {organizers}")
                    print(f"  Status: {status}")
                    print(f"  Attendees: {attendee_count}")
                    
                except Exception as e:
                    print(f"Error extracting event details: {str(e)}")
                    continue
            
            if not events:
                print(f"\nNo events found in {city}. Debug information:")
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
            
            print(f"\nSuccessfully processed {len(events)} events from {city}")
            
            # Save events to JSON file
            try:
                with open(f'luma_events_{city.lower().replace(" ", "_")}.json', 'w', encoding='utf-8') as f:
                    json.dump(events, f, indent=4, ensure_ascii=False)
                print(f"\nSaved {len(events)} events to luma_events_{city.lower().replace(' ', '_')}.json")
            except Exception as e:
                print(f"Error saving events to JSON file: {str(e)}")
            
            return events
            
        except Exception as e:
            print(f"Error scraping events for {city}: {str(e)}")
            if hasattr(e, 'msg'):
                print(f"Selenium error message: {e.msg}")
            return []

    def scrape_events(self, location: str) -> List[Dict]:
        """Main function to scrape events based on location"""
        return self.scrape_events_for_location(location)

def main():
    """Main function to run the scraper"""
    try:
        # Load environment variables
        load_dotenv()
        
        # Load intern profiles from JSON files
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

        scraper = LumaEventScraper()
        
        # Get events from both locations
        events = []
        for person_data in [person1_data, person2_data]:
            location_events = scraper.scrape_events(person_data['location'])
            events.extend(location_events)
        
        # Save all events to a combined JSON file
        try:
            with open('all_luma_events.json', 'w', encoding='utf-8') as f:
                json.dump(events, f, indent=4, ensure_ascii=False)
            print(f"\nSaved {len(events)} total events to all_luma_events.json")
        except Exception as e:
            print(f"Error saving combined events to JSON file: {str(e)}")
    
    except Exception as e:
        print(f"Error in main: {str(e)}")
    finally:
        if 'scraper' in locals():
            scraper.driver.quit()

if __name__ == "__main__":
    main()