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
    if (status.toLowerCase().includes('sold out')) return 'bg-red-500 text-white';
    if (status.toLowerCase().includes('near capacity')) return 'bg-orange-500 text-white';
    if (status.toLowerCase().includes('waitlist')) return 'bg-yellow-500 text-black';
    if (status.includes('$')) return 'bg-green-500 text-white';
    return 'bg-pink-500 text-white';
  };

  const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-3', 'rotate-1'];
  const rotation = rotations[index % rotations.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -10 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ rotate: 0, scale: 1.02, zIndex: 10 }}
      className={`scrapbook-card ${rotation} tape-effect bg-white p-6 w-full max-w-sm`}
    >
      {/* Match Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500 fill-current" />
          <span className="text-xl font-black text-gray-900 uppercase">
            {event.matchScore || 8}/10
          </span>
        </div>
        <div className="bg-pink-500 text-white px-3 py-1 font-black text-sm uppercase tracking-wide">
          #{index + 1}
        </div>
      </div>

      {/* Event Title */}
      <h3 className="text-lg font-black text-gray-900 mb-4 leading-tight uppercase">
        {event.title}
      </h3>

      {/* Event Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-pink-500" />
          <span className="text-sm font-medium">{event.date}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4 text-pink-500" />
          <span className="text-sm font-medium">{event.location}</span>
        </div>
        
        {event.attendees && (
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium">{event.attendees} attendees</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {event.status && (
        <div className={`inline-block px-3 py-1 text-sm font-black uppercase mb-4 ${getStatusColor(event.status)}`}>
          {event.status}
        </div>
      )}

      {/* Why it matches */}
      <div className="bg-pink-50 p-3 rounded-lg mb-4 border-2 border-pink-200">
        <p className="text-sm text-gray-800 font-medium">
          {event.whyMatches || 'Great match based on your shared interests!'}
        </p>
      </div>

      {/* Matching interests */}
      {(event.annaInterests?.length || event.jordanInterests?.length) && (
        <div className="mb-4">
          <p className="text-xs font-black text-gray-900 mb-2 uppercase tracking-wide">Matches:</p>
          <div className="flex flex-wrap gap-1">
            {[...(event.annaInterests || []), ...(event.jordanInterests || [])]
              .filter((interest, index, arr) => arr.indexOf(interest) === index)
              .slice(0, 4)
              .map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-pink-500 text-white text-xs font-bold uppercase"
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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-black text-white py-3 px-4 font-black uppercase tracking-wide hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
      >
        <ExternalLink className="w-4 h-4" />
        View Event
      </motion.a>
    </motion.div>
  );
};