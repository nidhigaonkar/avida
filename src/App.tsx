import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import PersonCard from './components/PersonCard';
import { ProfileForm, ProfileData } from './components/ProfileForm';
import { FindEventsButton } from './components/FindEventsButton';
import { EventList } from './components/EventList';
import { EventModal } from './components/EventModal';
import { MatchedEvent, Event, Person } from './types';

function App() {
  const [editingProfile, setEditingProfile] = useState<number | null>(null);
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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Elements */}
      <div className="fixed inset-0 bg-grunge">
        {/* Paint splatters */}
        <div className="paint-splatter w-32 h-32 top-20 left-10" />
        <div className="paint-splatter w-24 h-24 top-60 right-20" />
        <div className="paint-splatter w-40 h-40 bottom-40 left-1/4" />
        
        {/* Geometric shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-32 right-32 w-16 h-16 border-4 border-pink-500 opacity-30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-32 w-20 h-20 border-4 border-white opacity-20 rounded-full"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <h1 className="text-8xl md:text-9xl grunge-text text-white mb-4 relative">
            AVIDA
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-0 left-0 w-full h-2 bg-pink-500 origin-left"
            />
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl text-pink-400 font-bold tracking-wider"
          >
            EVENT MATCHER
          </motion.p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Profile Cards - Scrapbook Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative mb-20"
        >
          {/* Person 1 Card */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute left-0 top-0 z-20"
          >
            {editingProfile === 0 ? (
              <div className="w-96">
                <ProfileForm
                  title="Person 1"
                  profile={profile1}
                  onProfileChange={setProfile1}
                  personNumber={0}
                  onSave={() => setEditingProfile(null)}
                />
              </div>
            ) : (
              <div className="scrapbook-card tape-effect">
                <PersonCard 
                  person={person1} 
                  index={0} 
                  onEdit={() => setEditingProfile(0)}
                />
              </div>
            )}
          </motion.div>

          {/* Person 2 Card */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 1.5 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute right-0 top-20 z-20"
          >
            {editingProfile === 1 ? (
              <div className="w-96">
                <ProfileForm
                  title="Person 2"
                  profile={profile2}
                  onProfileChange={setProfile2}
                  personNumber={1}
                  onSave={() => setEditingProfile(null)}
                />
              </div>
            ) : (
              <div className="scrapbook-card tape-effect">
                <PersonCard 
                  person={person2} 
                  index={1} 
                  onEdit={() => setEditingProfile(1)}
                />
              </div>
            )}
          </motion.div>

          {/* Spacer for absolute positioned cards */}
          <div className="h-96" />
        </motion.div>

        {/* Find Events Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center mb-20"
        >
          <FindEventsButton
            onClick={findEvents}
            disabled={!canSearch}
            loading={loading}
          />
        </motion.div>

        {/* Events Section */}
        {(hasSearched || events.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="text-6xl grunge-text text-white mb-12 text-center"
            >
              PERFECT MATCHES
            </motion.h2>
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