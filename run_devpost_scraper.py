#!/usr/bin/env python3
"""
Simple runner script for the Devpost hackathon scraper
"""

from devpost_scraper import DevpostScraper
import json

def main():
    """Run the scraper with options"""
    print("Devpost Hackathon Scraper")
    print("=" * 40)
    
    try:
        scraper = DevpostScraper()
        
        # Scrape all hackathons
        print("\n1. Scraping all hackathons...")
        hackathons = scraper.scrape_hackathons()
        
        if not hackathons:
            print("No hackathons found. Exiting.")
            return
        
        # Show options
        print(f"\nFound {len(hackathons)} total hackathons")
        print("\nFiltering options:")
        print("1. Show all hackathons")
        print("2. Show only beginner-friendly hackathons") 
        print("3. Show only open hackathons")
        print("4. Show beginner-friendly AND open hackathons")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            selected_hackathons = hackathons
            filename = "devpost_hackathons_all.json"
        elif choice == "2":
            selected_hackathons = scraper.filter_beginner_friendly(hackathons)
            filename = "devpost_hackathons_beginner.json"
        elif choice == "3":
            selected_hackathons = scraper.filter_open_hackathons(hackathons)
            filename = "devpost_hackathons_open.json"
        elif choice == "4":
            beginner_hackathons = scraper.filter_beginner_friendly(hackathons)
            selected_hackathons = scraper.filter_open_hackathons(beginner_hackathons)
            filename = "devpost_hackathons_beginner_open.json"
        else:
            print("Invalid choice. Showing all hackathons.")
            selected_hackathons = hackathons
            filename = "devpost_hackathons_all.json"
        
        # Save and display results
        scraper.save_to_json(selected_hackathons, filename)
        scraper.print_summary(selected_hackathons)
        
        print(f"\n✓ Results saved to {filename}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        if 'scraper' in locals():
            del scraper

if __name__ == "__main__":
    main()