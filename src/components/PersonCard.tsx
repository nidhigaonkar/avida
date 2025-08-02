import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building, User, Edit3 } from 'lucide-react';
import { Person } from '../types';

interface PersonCardProps {
  person: Person;
  index: number;
  onEdit: () => void;
}

export default function PersonCard({ person, index, onEdit }: PersonCardProps) {
  return (
    <div className="w-80 bg-white p-6 relative">
      {/* Edit Button */}
      <motion.button
        onClick={onEdit}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 p-2 bg-pink-500 hover:bg-pink-600 rounded-full text-white shadow-lg z-10"
      >
        <Edit3 className="w-4 h-4" />
      </motion.button>
      
      {/* Profile Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
        <User className="w-20 h-20 text-white" />
      </div>
      
      {/* Name */}
      <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-wide">
        {person.name || 'Add Name'}
      </h3>
      
      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-bold">Age:</span>
          <span>{person.age}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4 text-pink-500" />
          <span className="text-sm">{person.location || 'Add location'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Building className="w-4 h-4 text-pink-500" />
          <span className="text-sm">{person.company || 'Add company'}</span>
        </div>
      </div>
      
      {/* Interests */}
      <div className="mb-4">
        <h4 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-wide">
          Interests
        </h4>
        <div className="flex flex-wrap gap-1">
          {person.interests.length > 0 ? (
            person.interests.slice(0, 6).map((interest, idx) => (
              <span
                key={interest}
                className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs font-bold uppercase"
              >
                {interest}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm italic">Click edit to add interests</span>
          )}
          {person.interests.length > 6 && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
              +{person.interests.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-100 p-3 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 font-bold">Total Interests:</span>
          <span className="font-black text-pink-600">{person.interests.length}</span>
        </div>
      </div>
    </div>
  );
}