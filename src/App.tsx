import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import PersonCard from './components/PersonCard';
import StatsSection from './components/StatsSection';
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

  const totalEvents = 50; // Mock total events
  const cities = ['New York', 'San Francisco']; // Mock cities

  return (
    <div className="min-h-screen text-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="text-center py-16 relative overflow-hidden">
        {/* Floating background elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-20 right-1/3 w-24 h-24 bg-purple-300/10 rounded-full blur-lg"
        />
        <motion.div
          animate={{
            y: [0, -10, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-10 left-1/3 w-20 h-20 bg-pink-300/10 rounded-full blur-lg"
        />

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mb-6"
          >
            <motion.h1 
              className="text-7xl font-bold mb-2 bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              Avida
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100px' }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"
            />
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <motion.p 
              className="text-2xl text-purple-100 mb-3 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              AI-Powered Event Matching
            </motion.p>
            <motion.p 
              className="text-lg text-purple-200 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Discover perfect events that match both of your interests. 
              Create unforgettable experiences together with intelligent recommendations.
            </motion.p>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {['🤖 AI-Powered', '🎯 Perfect Matches', '🌟 Real Events'].map((badge, index) => (
              <motion.span
                key={badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

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
          {editingProfile === 0 ? (
            <ProfileForm
              title="Person 1"
              profile={profile1}
              onProfileChange={setProfile1}
              personNumber={0}
              onSave={() => setEditingProfile(null)}
            />
          ) : (
            <PersonCard 
              person={person1} 
              index={0} 
              onEdit={() => setEditingProfile(0)}
            />
          )}
          
          {editingProfile === 1 ? (
            <ProfileForm
              title="Person 2"
              profile={profile2}
              onProfileChange={setProfile2}
              personNumber={1}
              onSave={() => setEditingProfile(null)}
            />
          ) : (
            <PersonCard 
              person={person2} 
              index={1} 
              onEdit={() => setEditingProfile(1)}
            />
          )}
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