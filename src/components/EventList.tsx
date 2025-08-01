import { motion } from 'framer-motion';
import { MatchedEvent } from '../types';
import EventCard from './EventCard';
import { Trophy, Sparkles } from 'lucide-react';

interface EventListProps {
  events: MatchedEvent[];
  onEventSelect: (event: Event) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEventSelect }) => {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
        <p className="text-gray-500">Try adjusting the search criteria or check back later.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            Top Event Matches
          </h2>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
        <p className="text-gray-600">
          Here are the best events for both of you to attend together
        </p>
      </motion.div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <EventCard
            key={`${event.link}-${index}`}
            event={event}
            index={index}
            rank={index + 1}
            onViewDetails={onEventSelect}
          />
        ))}
      </div>
    </motion.div>
  );
}