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
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-dashed border-white/50">
          <Calendar className="w-12 h-12 text-white/60" />
        </div>
        <h3 className="text-4xl font-black text-white mb-4 grunge-text">NO EVENTS FOUND</h3>
        <p className="text-pink-400 max-w-md mx-auto text-lg font-bold uppercase tracking-wide">
          Try adjusting your profiles to find matching events
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-12"
    >
      {/* Events Grid - Scattered Layout */}
      <div className="relative">
        {events.map((event, index) => (
          <motion.div
            key={`${event.link}-${index}`}
            initial={{ opacity: 0, y: 100, rotate: Math.random() * 20 - 10 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotate: Math.random() * 6 - 3,
              x: index % 2 === 0 ? Math.random() * 50 - 25 : Math.random() * 50 - 25
            }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className={`
              ${index % 3 === 0 ? 'ml-0' : index % 3 === 1 ? 'ml-auto mr-20' : 'ml-20'}
              ${index > 0 ? 'mt-8' : ''}
              w-fit
            `}
          >
            <EventCard
              event={event}
              index={index}
              onViewDetails={onEventSelect}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};