import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import PersonCard from './components/PersonCard';
import StatsSection from './components/StatsSection';
import { ProfileData } from './components/ProfileForm';
import { FindEventsButton } from './components/FindEventsButton';
import { EventList } from './components/EventList';
import { EventModal } from './components/EventModal';
import { MatchedEvent, Event, Person } from './types';

function App() {
  const [profile1, setProfile1] = useState<ProfileData>({
    name: '',
    age: 18,
    location: '',
    company: '',
    interests: []
  });
  
  const [profile2, setProfile2] = useState<ProfileData>({
    name: '',
    age: 18,
    location: '',
    company: '',
    interests: []
  });

  const [events, setEvents] = useState<MatchedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load default data from JSON files
  React.useEffect(() => {
    const loadDefaultData = async () => {
      try {
        const [person1Response, person2Response] = await Promise.all([
          fetch('/intern1.json'),
          fetch('/intern2.json')
        ]);
        
        const person1Data = await person1Response.json();
        const person2Data = await person2Response.json();
        
        setProfile1({
          name: person1Data.name,
          age: person1Data.age,
          location: person1Data.location,
          company: person1Data.company,
          interests: person1Data.interests
        });
        
        setProfile2({
          name: person2Data.name,
          age: person2Data.age,
          location: person2Data.location,
          company: person2Data.company,
          interests: person2Data.interests
        });
      } catch (error) {
        console.error('Error loading default data:', error);
      }
    };

    loadDefaultData();
  }, []);

  const isFormValid = (profile: ProfileData) => {
    return profile.name.trim() && 
           profile.location.trim() && 
           profile.company.trim() && 
           profile.interests.length > 0;
  };

  const canSearch = isFormValid(profile1) && isFormValid(profile2);

  const findEvents = async () => {
    if (!canSearch) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Load events from the existing data files
      const response = await fetch('/all_luma_events.json');
      const allEvents = await response.json();

      // Create mock matched events with AI-style scoring
      const mockMatches: MatchedEvent[] = allEvents.slice(0, 6).map((event: any, index: number) => ({
        ...event,
        matchScore: Math.floor(Math.random() * 3) + 8, // Score between 8-10
        whyMatches: generateWhyMatches(event, profile1, profile2),
        annaInterests: getMatchingInterests(profile1.interests, event),
        jordanInterests: getMatchingInterests(profile2.interests, event),
        person1_name: profile1.name,
        person2_name: profile2.name,
      }));

      // Sort by match score
      mockMatches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      setEvents(mockMatches);
    } catch (error) {
      console.error('Error finding events:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWhyMatches = (event: any, person1: ProfileData, person2: ProfileData) => {
    const eventTitle = event.title.toLowerCase();
    
    if (eventTitle.includes('tech') || eventTitle.includes('ai')) {
      return 'Perfect blend of technology and networking opportunities for both profiles';
    }
    if (eventTitle.includes('founder') || eventTitle.includes('startup')) {
      return 'Great for entrepreneurial networking and startup community building';
    }
    if (eventTitle.includes('coffee') || eventTitle.includes('run')) {
      return 'Combines fitness and coffee culture - ideal for active professionals';
    }
    if (eventTitle.includes('art') || eventTitle.includes('creative')) {
      return 'Creative expression meets professional networking';
    }
    return 'Excellent match based on shared interests and location preferences';
  };

  const getMatchingInterests = (interests: string[], event: any) => {
    const eventTitle = event.title.toLowerCase();
    const eventDesc = event.description.toLowerCase();
    
    return interests.filter(interest => {
      const interestLower = interest.toLowerCase();
      return eventTitle.includes(interestLower) || 
             eventDesc.includes(interestLower) ||
             (interestLower.includes('tech') && (eventTitle.includes('tech') || eventTitle.includes('ai'))) ||
             (interestLower.includes('startup') && eventTitle.includes('founder')) ||
             (interestLower.includes('coffee') && eventTitle.includes('coffee'));
    }).slice(0, 3);
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Convert ProfileData to Person for PersonCard component
  const person1: Person = {
    name: profile1.name,
    age: profile1.age,
    location: profile1.location,
    company: profile1.company,
    interests: profile1.interests
  };

  const person2: Person = {
    name: profile2.name,
    age: profile2.age,
    location: profile2.location,
    company: profile2.company,
    interests: profile2.interests
  };

  const totalEvents = 50; // Mock total events
  const cities = ['New York', 'San Francisco']; // Mock cities

  return (
    <div className="min-h-screen text-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Avida
        </h1>
        <p className="text-xl text-purple-100 mb-2">
          AI-Powered Event Matching for Perfect Adventures Together
        </p>
        <p className="text-lg text-purple-200">
          Find events that match both of your interests and create amazing memories
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Stats Section */}
        <StatsSection 
          totalEvents={totalEvents}
          matchedEvents={events.length}
          cities={cities}
        />

        {/* Profile Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          <PersonCard person={person1} index={0} />
          <PersonCard person={person2} index={1} />
        </motion.div>

        {/* Find Events Button */}
        <FindEventsButton
          onClick={findEvents}
          disabled={!canSearch}
          loading={loading}
        />

        {/* Events Section */}
        {(hasSearched || events.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <EventList events={events} onEventSelect={handleEventSelect} />
          </motion.div>
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}

export default App;