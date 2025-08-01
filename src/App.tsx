import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import PersonCard from './components/PersonCard';
import { EventList } from './components/EventList';
import StatsSection from './components/StatsSection';
import LoadingSpinner from './components/LoadingSpinner';
import { FilterPanel } from './components/FilterPanel';
import { SearchBar } from './components/SearchBar';
import { EventModal } from './components/EventModal';
import { useEventData } from './hooks/useEventData';
import { Person, Event } from './types';
import React, { useState, useMemo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

function App() {
  const { person1, person2, events, loading, error } = useEventData();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minScore: 0,
    cities: [] as string[],
    status: [] as string[]
  });

  // Get available filter options
  const availableCities = useMemo(() => {
    const cities = [...new Set(events.map(event => event.city))];
    return cities.filter(Boolean);
  }, [events]);

  const availableStatuses = useMemo(() => {
    const statuses = [...new Set(events.map(event => event.status))];
    return statuses;
  }, [events]);

  // Initialize filters when events load
  React.useEffect(() => {
    if (availableCities.length > 0 && filters.cities.length === 0) {
      setFilters(prev => ({
        ...prev,
        cities: availableCities,
        status: availableStatuses
      }));
    }
  }, [availableCities, availableStatuses]);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.whyMatches.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Score filter
      const matchesScore = event.matchScore >= filters.minScore;
      
      // City filter
      const matchesCity = filters.cities.length === 0 || filters.cities.includes(event.city);
      
      // Status filter
      const matchesStatus = filters.status.length === 0 || filters.status.includes(event.status);
      
      return matchesSearch && matchesScore && matchesCity && matchesStatus;
    });
  }, [events, searchTerm, filters]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto px-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const uniqueCities = [...new Set(events.map(event => event.city).filter(Boolean))];

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* People Section */}
        {person1 && person2 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Meet the Team
              </h2>
              <p className="text-gray-600">
                Finding perfect events for these amazing people
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PersonCard person={person1} index={0} />
              <PersonCard person={person2} index={1} />
            </div>
          </motion.section>
        )}

        {/* Search and Filter Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filters</span>
              {(filters.minScore > 0 || filters.cities.length < availableCities.length || filters.status.length < availableStatuses.length) && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          </div>
          
          {/* Active filters display */}
          {(searchTerm || filters.minScore > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-blue-200 rounded-full p-0.5">
                    ×
                  </button>
                </span>
              )}
              {filters.minScore > 0 && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  Min Score: {filters.minScore}
                  <button onClick={() => setFilters(prev => ({ ...prev, minScore: 0 }))} className="ml-1 hover:bg-purple-200 rounded-full p-0.5">
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
          
          <p className="text-center text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </motion.section>

        {/* Stats Section - Updated */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <StatsSection
            totalEvents={events.length}
            matchedEvents={events.length}
            cities={uniqueCities}
          />
        </motion.section>

        {/* Events Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <EventList events={filteredEvents} onEventSelect={handleEventSelect} />
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="bg-white/50 backdrop-blur-sm border-t border-white/20 py-8 mt-16"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            Our AI has analyzed all events and found the perfect matches for Anna and Jordan based on their shared interests and preferences.
          </p>
          <p className="text-gray-600">
            Powered by AI • Built with ❤️ for better connections
          </p>
        </div>
      </motion.footer>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        availableCities={availableCities}
        availableStatuses={availableStatuses}
      />

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;