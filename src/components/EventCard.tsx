import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, ExternalLink, Star } from 'lucide-react';
import { MatchedEvent, Event } from '../types';

interface EventCardProps {
  event: MatchedEvent;
  index: number;
  onViewDetails: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('sold out')) return 'bg-coral text-white';
    if (status.toLowerCase().includes('near capacity')) return 'bg-peach text-brown';
    if (status.toLowerCase().includes('waitlist')) return 'bg-sunshine text-brown';
    if (status.includes('$')) return 'bg-mint text-brown';
    return 'bg-sky text-brown';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? 0.5 : -0.5 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="event-card"
    >
      {/* Match Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-sunshine fill-current" />
          <span className="text-xl font-bold handwritten text-brown">
            {event.matchScore || 8}/10 Match
          </span>
        </div>
        <div className="handwritten text-brown text-lg font-semibold bg-sunshine/20 px-3 py-1 rounded-full">
          #{index + 1}
        </div>
      </div>

      {/* Event Title */}
      <h3 className="text-xl font-bold text-brown mb-4 leading-tight hover:text-coral transition-colors">
        {event.title}
      </h3>

      {/* Event Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-brown">
          <Clock className="w-5 h-5 text-coral flex-shrink-0" />
          <span className="text-sm">{event.date}</span>
        </div>
        
        <div className="flex items-center gap-3 text-brown">
          <MapPin className="w-5 h-5 text-sky flex-shrink-0" />
          <span className="text-sm">{event.location}</span>
        </div>
        
        {event.attendees && (
          <div className="flex items-center gap-3 text-brown">
            <Users className="w-5 h-5 text-mint flex-shrink-0" />
            <span className="text-sm">{event.attendees} attendees</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {event.status && (
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold handwritten mb-4 ${getStatusColor(event.status)}`}>
          {event.status}
        </div>
      )}

      {/* Why it matches */}
      <div className="bg-gradient-to-r from-sunshine/20 to-peach/20 p-4 rounded-xl mb-6 border-2 border-dashed border-sunshine/30">
        <p className="text-sm text-brown font-medium handwritten">
          🎯 {event.whyMatches || 'Great match based on your shared interests!'}
        </p>
      </div>

      {/* Matching interests */}
      {(event.annaInterests?.length || event.jordanInterests?.length) && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-brown mb-3 handwritten">Matching Interests:</p>
          <div className="flex flex-wrap gap-2">
            {[...(event.annaInterests || []), ...(event.jordanInterests || [])]
              .filter((interest, index, arr) => arr.indexOf(interest) === index)
              .slice(0, 4)
              .map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-mint text-brown rounded-full text-xs font-medium handwritten border-2 border-mint/50"
                >
                  {interest}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <motion.a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, rotate: 0 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-coral to-peach text-white py-4 px-6 rounded-xl font-bold handwritten text-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 border-2 border-coral/30 transform -rotate-1 hover:rotate-0"
      >
        <ExternalLink className="w-5 h-5" />
        View Event on Luma
      </motion.a>
    </motion.div>
  );
};