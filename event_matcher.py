import json
import os
import requests
from typing import List, Dict
from dataclasses import dataclass
from dotenv import load_dotenv

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
    def __init__(self):
        """Initialize the event matcher"""
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        if not self.api_key:
            print("Warning: DEEPSEEK_API_KEY not set in .env file")

    def get_common_interests(self, person1: Person, person2: Person) -> List[str]:
        """Find common interests between two people"""
        interests1 = set(i.lower() for i in person1.interests)
        interests2 = set(i.lower() for i in person2.interests)
        return list(interests1.intersection(interests2))

    def find_matching_events(self, events: List[Dict], person1: Person, person2: Person) -> str:
        """Find events that match both people's interests using AI"""
        if not events:
            print("No events to process.")
            return ""
        
        # Get common interests between both people
        common_interests = self.get_common_interests(person1, person2)
        print(f"\nCommon interests between {person1.name} and {person2.name}:")
        print(", ".join(common_interests))
        
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
            for i, event in enumerate(events)
        ])

        prompt = f"""Given a list of events and two people's interests, find the top 3 best events that would be good for both people to attend together.

Events:
{events_text}

Person 1 ({person1.name})'s Interests: {', '.join(person1.interests)}
Person 2 ({person2.name})'s Interests: {', '.join(person2.interests)}

Please analyze all events and select the top 3 that would be best for both people to attend together. For each event:
1. Explain why it's a good match for both people, citing which specific interests match for each person (max 20 word explanation)
2. Give it a match score from 0-10 based on how well it matches their combined interests

Format your response exactly like this example, with no asterisks:

Here are the top 3 events that would be best for {person1.name} and {person2.name} to attend together, ordered by match score:

---

1. [Event Title]
Date: [Event Time]
Location: [Event Location]
City: [Event City]
Organizers: [Event Organizers]
Status: [Event Status]
Attendees: [Attendee Count]
Link: [Event URL]
Match Score: [0-10]/10
Why this matches: [explanation]
{person1.name}'s Matching Interests: [interests]
{person2.name}'s Matching Interests: [interests]

---

2. [Next Event...]
[Same format as above]

---

3. [Last Event...]
[Same format as above]

Order the events by match score from highest to lowest. Only include events that would genuinely interest both people. Make sure at least 2 events are displayed"""

        try:
            if not self.api_key:
                print("Error: DEEPSEEK_API_KEY not set in .env file")
                print("Please make sure your .env file contains: DEEPSEEK_API_KEY=your_api_key")
                return ""

            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'deepseek-chat',
                'messages': [
                    {'role': 'user', 'content': prompt}
                ],
                'temperature': 0.7,
                'max_tokens': 2000
            }
            
            response = requests.post(
                'https://api.deepseek.com/v1/chat/completions',
                headers=headers,
                json=data
            )
            
            if response.status_code != 200:
                print(f"Error from Deepseek API: {response.text}")
                return ""
            
            # Get the AI response
            response_json = response.json()
            ai_response = response_json['choices'][0]['message']['content']
            
            # Save the AI response to a text file
            try:
                with open('ai_matches.txt', 'w', encoding='utf-8') as f:
                    f.write(ai_response)
                print("\nAI matches saved to ai_matches.txt")
            except Exception as e:
                print(f"Error saving AI response: {str(e)}")
            
            return ai_response
                
        except Exception as e:
            print(f"Error getting matches from Deepseek: {str(e)}")
            return ""

    def display_matches(self, matches: str) -> None:
        """Display the AI's event matches"""
        if not matches:
            print("\nNo matching events found.")
            return
        
        print("\nTop event suggestions:")
        print(matches)
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

        # Load events
        try:
            with open('all_luma_events.json', 'r') as f:
                events = json.load(f)
        except FileNotFoundError:
            print("Error: all_luma_events.json not found. Please run luma_scraper.py first.")
            return
        except json.JSONDecodeError:
            print("Error: Invalid JSON format in all_luma_events.json")
            return

        # Create Person objects
        person1 = Person.from_json(person1_data)
        person2 = Person.from_json(person2_data)

        # Find and display matches
        matcher = EventMatcher()
        matches = matcher.find_matching_events(events, person1, person2)
        matcher.display_matches(matches)

    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main() 