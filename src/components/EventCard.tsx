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
    return 'bg-blue-500 text-white';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
    >
      {/* Match Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400 fill-current" />
          <span className="text-xl font-bold text-white">
            {event.matchScore || 8}/10 Match
          </span>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          #{index + 1}
        </div>
      </div>

      {/* Event Title */}
      <h3 className="text-xl font-bold text-white mb-4 leading-tight">
        {event.title}
      </h3>

      {/* Event Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-purple-100">
          <Clock className="w-5 h-5 text-purple-300 flex-shrink-0" />
          <span className="text-sm">{event.date}</span>
        </div>
        
        <div className="flex items-center gap-3 text-purple-100">
          <MapPin className="w-5 h-5 text-purple-300 flex-shrink-0" />
          <span className="text-sm">{event.location}</span>
        </div>
        
        {event.attendees && (
          <div className="flex items-center gap-3 text-purple-100">
            <Users className="w-5 h-5 text-purple-300 flex-shrink-0" />
            <span className="text-sm">{event.attendees} attendees</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {event.status && (
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${getStatusColor(event.status)}`}>
          {event.status}
        </div>
      )}

      {/* Why it matches */}
      <div className="bg-white/10 p-4 rounded-xl mb-6 border border-white/20">
        <p className="text-sm text-purple-100 font-medium">
          🎯 {event.whyMatches || 'Great match based on your shared interests!'}
        </p>
      </div>

      {/* Matching interests */}
      {(event.annaInterests?.length || event.jordanInterests?.length) && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-purple-200 mb-3">Matching Interests:</p>
          <div className="flex flex-wrap gap-2">
            {[...(event.annaInterests || []), ...(event.jordanInterests || [])]
              .filter((interest, index, arr) => arr.indexOf(interest) === index)
              .slice(0, 4)
              .map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full text-xs font-medium"
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
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
      >
        <ExternalLink className="w-5 h-5" />
        View Event on Luma
      </motion.a>
    </motion.div>
  );
};