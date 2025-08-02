import React from 'react';
import { motion } from 'framer-motion';
import { MatchedEvent, Event } from '../types';
import { EventCard } from './EventCard';
import { Trophy, Calendar } from 'lucide-react';

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
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-600 mb-2">No Events Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your locations or interests to find matching events in your area.
        </p>
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
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-900">
            Perfect Event Matches
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Here are the best events for both of you to attend together, ranked by compatibility
        </p>
      </motion.div>

      {/* Events Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <EventCard
            key={`${event.link}-${index}`}
            event={event}
            index={index}
            onViewDetails={onEventSelect}
          />
        ))}
      </div>
    </motion.div>
  );
};