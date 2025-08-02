import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import { ProfileForm, ProfileData } from './components/ProfileForm';
import { FindEventsButton } from './components/FindEventsButton';
import { EventList } from './components/EventList';
import { EventModal } from './components/EventModal';
import { MatchedEvent, Event } from './types';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Profile Forms Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your Profiles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out both profiles to discover events that match your combined interests and preferences
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <ProfileForm
              title="Person 1"
              onProfileChange={setProfile1}
              gradient="from-pink-500 to-rose-500"
            />
            <ProfileForm
              title="Person 2"
              onProfileChange={setProfile2}
              gradient="from-blue-500 to-indigo-500"
            />
          </div>
        </motion.section>

        {/* Find Events Button */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <FindEventsButton
            onClick={findEvents}
            disabled={!canSearch}
            loading={loading}
          />
        </motion.section>

        {/* Events Section */}
        {(hasSearched || events.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <EventList events={events} onEventSelect={handleEventSelect} />
          </motion.section>
        )}
      </main>

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