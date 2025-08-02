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
    if (status.toLowerCase().includes('sold out')) return 'bg-red-50 text-red-700 border-red-200';
    if (status.toLowerCase().includes('near capacity')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (status.toLowerCase().includes('waitlist')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (status.includes('$')) return 'bg-green-50 text-green-700 border-green-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
    >
      {/* Match Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
          <span className="text-lg font-bold text-gray-900">
            {event.matchScore || 8}/10 Match
          </span>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          #{index + 1}
        </div>
      </div>

      {/* Event Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
        {event.title}
      </h3>

      {/* Event Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-600">
          <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="text-sm">{event.date}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-600">
          <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span className="text-sm">{event.location}</span>
        </div>
        
        {event.attendees && (
          <div className="flex items-center gap-3 text-gray-600">
            <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">{event.attendees} attendees</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {event.status && (
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getStatusColor(event.status)}`}>
          {event.status}
        </div>
      )}

      {/* Why it matches */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-6">
        <p className="text-sm text-gray-700 font-medium">
          🎯 {event.whyMatches || 'Great match based on your shared interests!'}
        </p>
      </div>

      {/* Matching interests */}
      {(event.annaInterests?.length || event.jordanInterests?.length) && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Matching Interests</p>
          <div className="flex flex-wrap gap-2">
            {[...(event.annaInterests || []), ...(event.jordanInterests || [])]
              .filter((interest, index, arr) => arr.indexOf(interest) === index)
              .slice(0, 4)
              .map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200"
                >
                  {interest}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
        View Event on Luma
      </a>
    </motion.div>
  );
};