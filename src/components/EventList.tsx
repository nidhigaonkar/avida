import React from 'react';
import { motion } from 'framer-motion';
import { MatchedEvent, Event } from '../types';
import { EventCard } from './EventCard';
import { Calendar } from 'lucide-react';

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
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-white/30">
          <Calendar className="w-12 h-12 text-white/60" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">No Events Found</h3>
        <p className="text-purple-200 max-w-md mx-auto text-lg">
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
        className="text-center glass-card rounded-2xl p-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-4xl">🏆</span>
          <h2 className="text-4xl font-bold text-white">
            Perfect Event Matches
          </h2>
          <span className="text-4xl">🎉</span>
        </div>
        <p className="text-lg text-purple-100 max-w-2xl mx-auto">
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