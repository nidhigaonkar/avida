import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Eye, Star } from 'lucide-react';
import { MatchedEvent } from '../types';
import { InterestTag } from './InterestTag';
import { Event } from '../types';

interface EventCardProps {
  event: MatchedEvent;
  index: number;
  onViewDetails: (event: Event) => void;
  rank: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index, onViewDetails, rank }) => {
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('sold out')) return 'bg-red-100 text-red-700 border-red-200';
    if (status.toLowerCase().includes('near capacity')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (status.toLowerCase().includes('waitlist')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (status.includes('$')) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-500';
      case 2: return 'from-gray-300 to-gray-400';
      case 3: return 'from-amber-600 to-amber-700';
      default: return 'from-primary-400 to-primary-500';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '⭐';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-[1.02] group"
    >
      {/* Rank Badge */}
      <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${getRankColor(rank)} rounded-full flex items-center justify-center shadow-lg`}>
        <span className="text-white font-bold text-lg">{getRankIcon(rank)}</span>
      </div>

      {/* Match Score */}
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500 fill-current" />
        <span className="text-lg font-semibold text-gray-800">
          {event.match_score || 'N/A'}/10 Match
        </span>
      </div>

      {/* Event Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-3 pr-16 leading-tight group-hover:text-primary-600 transition-colors">
        {event.title}
      </h3>

      {/* Event title */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {event.title}
      </h3>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-3 text-gray-600">
          <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <span className="text-sm">{event.date}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-600">
          <MapPin className="w-4 h-4 text-accent-500 flex-shrink-0" />
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

      {/* Matching interests preview */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Matching Interests:</p>
        <div className="flex flex-wrap gap-1">
          {[...event.annaInterests, ...event.jordanInterests]
            .filter((interest, index, arr) => arr.indexOf(interest) === index)
            .slice(0, 3)
            .map((interest, index) => (
              <InterestTag key={index} interest={interest} isMatching />
            ))}
          {([...event.annaInterests, ...event.jordanInterests].filter((interest, index, arr) => arr.indexOf(interest) === index).length > 3) && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{[...event.annaInterests, ...event.jordanInterests].filter((interest, index, arr) => arr.indexOf(interest) === index).length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Matching Interests */}
      {(event.person1_matches || event.person2_matches) && (
        <div className="space-y-3 mb-4">
          {event.person1_matches && event.person1_matches.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                {event.person1_name}'s matching interests:
              </p>
              <div className="flex flex-wrap gap-1">
                {event.person1_matches.map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Why it matches - condensed */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-4">
        <p className="text-sm text-gray-700 line-clamp-2">
          🎯 {event.whyMatches}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(event)}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Details
        </button>
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
        >
          View on Luma
        </a>
      </div>
    </motion.div>
  );
}

export default EventCard