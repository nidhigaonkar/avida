import json
import requests
from typing import List, Dict, Set
from dataclasses import dataclass
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

@dataclass
class Person:
    name: str
    interests: List[str]
    location: str

    @classmethod
    def from_json(cls, data: Dict) -> 'Person':
        return cls(
            name=data['name'],
            interests=data['interests'],
            location=data['location']
        )

class EventMatcher:
    def __init__(self, events_file: str = 'all_luma_events.json'):
        """Initialize the matcher with events from JSON file"""
        try:
            with open(events_file, 'r', encoding='utf-8') as f:
                self.events = json.load(f)
            print(f"Loaded {len(self.events)} events from {events_file}")
            
            # Get API key from environment
            self.api_key = os.getenv('DEEPSEEK_API_KEY')
            if not self.api_key:
                print("Warning: DEEPSEEK_API_KEY not found in .env file")
                
        except FileNotFoundError:
            print(f"Error: {events_file} not found. Please run luma_scraper.py first.")
            self.events = []
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON format in {events_file}")
            self.events = []

    def get_top_matching_events(self, person1: Person, person2: Person) -> List[Dict]:
        """Use Deepseek API to find the top 3 best matching events for both people"""
        
        if not self.api_key:
            print("Error: DEEPSEEK_API_KEY not set in .env file")
            return []

        # Construct a single prompt with all events
        events_text = "\n\n".join([
            f"Event {i+1}:\n"
            f"Title: {event['title']}\n"
            f"Description: {event['description']}\n"
            f"Location: {event['location']}\n"
            f"City: {event['city']}\n"
            f"Date: {event['date']}\n"
            f"Link: {event['link']}\n"
            f"Organizers: {event['organizers']}\n"
            f"Status: {event['status']}\n"
            f"Attendees: {event['attendees']}"
            for i, event in enumerate(self.events)
        ])

        prompt = f"""Given a list of events and two people's interests, find the top 3 best events that would be good for both people to attend together.

Events:
{events_text}

Person 1 ({person1.name})'s Interests: {', '.join(person1.interests)}
Person 2 ({person2.name})'s Interests: {', '.join(person2.interests)}

Please analyze all events and select the top 3 that would be best for both people to attend together. For each selected event:
1. Explain why it's a good match for both people
2. List which specific interests match for each person
3. Give it a match score from 0-10 based on how well it matches their combined interests

Format your response as a JSON array with exactly 3 objects (the best 3 events), each containing:
{{
    "title": "Event Title",
    "date": "Event Time",
    "location": "Event Location",
    "city": "Event City",
    "organizers": "Event Organizers",
    "status": "Event Status",
    "attendees": "Attendee Count",
    "link": "Event URL",
    "description": "Event Description",
    "match_score": 8,
    "person1_matches": ["interest1", "interest2"],
    "person2_matches": ["interest3", "interest4"],
    "match_explanation": "Detailed explanation of why this event is good for both people"
}}

Order the events by match_score from highest to lowest. Only include events that would genuinely interest both people. Minimum 2 events"""

        # Call Deepseek API
        try:
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.3,
                    "max_tokens": 2000
                }
            )
            
            print("\nAPI Response Status Code:", response.status_code)
            
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # Remove the markdown code block markers if present
            content = content.strip()
            if content.startswith('```json\n'):
                content = content[7:]
            if content.endswith('\n```'):
                content = content[:-4]
            
            top_events = json.loads(content)
            
            # Add person names to each event
            for event in top_events:
                event.update({
                    'person1_name': person1.name,
                    'person2_name': person2.name
                })
            
            return top_events
            
        except json.JSONDecodeError as je:
            print(f"\nJSON Decode Error: {str(je)}")
            print("Error occurred at position:", je.pos)
            print("Line number:", je.lineno)
            print("Column number:", je.colno)
            print("\nContent that failed to parse:", content)
            return []
        except Exception as e:
            print(f"\nDetailed error: {str(e)}")
            print(f"Error type: {type(e)}")
            if hasattr(e, '__traceback__'):
                import traceback
                print("\nFull traceback:")
                traceback.print_tb(e.__traceback__)
            return []

    def find_matching_events(self, person1: Person, person2: Person) -> List[Dict]:
        """Find top 3 events that match both people's interests"""
        if not self.events:
            print("No events to process.")
            return []
            
        print(f"\nFinding the best events for {person1.name} and {person2.name}...")
        
        # Get top 3 matching events directly from Deepseek
        top_events = self.get_top_matching_events(person1, person2)
        
        if not top_events:
            print("\nNo matching events found.")
            print(f"Searched through {len(self.events)} events.")
            return []
        
        print(f"\nFound top 3 event suggestions for {person1.name} and {person2.name}!")
        
        # Save top 3 matching events to a separate JSON file
        try:
            with open('top_matching_events.json', 'w', encoding='utf-8') as f:
                json.dump(top_events, f, indent=4, ensure_ascii=False)
            print("Top matching events saved to top_matching_events.json")
        except Exception as e:
            print(f"Error saving matching events: {str(e)}")
        
        return top_events

    def display_matching_events(self, events: List[Dict]) -> None:
        """Display matching events with detailed interest information"""
        if not events:
            return
            
        for i, event in enumerate(events, 1):
            print(f"\nSuggestion {i} (Match Score: {event['match_score']}/10):")
            print(f"Title: {event['title']}")
            print(f"City: {event['city']}")
            print(f"Time: {event['date']}")
            print(f"Location: {event['location']}")
            print(f"Organizers: {event['organizers']}")
            print(f"Status: {event['status']}")
            print(f"Attendees: {event['attendees']}")
            print(f"Link: {event['link']}")
            print(f"\nWhy this event matches:")
            print(event['match_explanation'])
            print(f"\n{event['person1_name']}'s Matching Interests: {', '.join(event['person1_matches'])}")
            print(f"{event['person2_name']}'s Matching Interests: {', '.join(event['person2_matches'])}")
            print("-" * 80)

def main():
    """Main function to run the event matcher"""
    try:
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

        # Create Person objects
        person1 = Person.from_json(person1_data)
        person2 = Person.from_json(person2_data)
        
        # Initialize matcher and find matching events
        matcher = EventMatcher()
        matching_events = matcher.find_matching_events(person1, person2)
        
        if matching_events:
            matcher.display_matching_events(matching_events)
            
    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main() 