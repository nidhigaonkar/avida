import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building, User, Heart, Sparkles, Edit3 } from 'lucide-react';
import { Person } from '../types';
import { InterestTag } from './InterestTag';

interface PersonCardProps {
  person: Person;
  index: number;
  onEdit: () => void;
}

export default function PersonCard({ person, index, onEdit }: PersonCardProps) {
  const avatarColors = person.name === 'Anna' ? 'from-pink-400 to-purple-500' : 'from-blue-400 to-indigo-500';

  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
      className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      {/* Edit Button */}
      <div className="flex justify-end mb-4">
        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200"
        >
          <Edit3 className="w-4 h-4 text-white" />
        </motion.button>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${avatarColors} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{person.name}</h3>
          <div className="flex items-center gap-1 text-gray-600">
            <Sparkles className="w-4 h-4" />
            <span>Age {person.age}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-primary-500" />
          <span className="text-sm">{person.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Building className="w-4 h-4 text-accent-500" />
          <span className="text-sm">{person.company}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <Heart className="w-4 h-4 text-red-400" />
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>🎯</span>
          Interests
        </h4>
        <div className="flex flex-wrap gap-2">
          {person.interests.slice(0, 6).map((interest, idx) => (
            <motion.span
              key={interest}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="px-3 py-1 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full text-xs font-medium border border-primary-200"
            >
              {interest}
            </motion.span>
          ))}
          {person.interests.slice(0, 8).map((interest, index) => (
            <InterestTag key={index} interest={interest} delay={index * 0.05} />
          ))}
          {person.interests.length > 8 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full"
            >
              +{person.interests.length - 8} more
            </motion.span>
          )}
        </div>
      </div>

      {/* Fun stats */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Interests:</span>
          <span className="font-semibold text-gray-900">{person.interests.length}</span>
        </div>
      </div>
    </motion.div>
  );
}