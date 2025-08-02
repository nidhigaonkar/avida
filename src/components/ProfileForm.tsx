import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface ProfileData {
  name: string;
  age: number;
  location: string;
  company: string;
  interests: string[];
}

interface ProfileFormProps {
  title: string;
  onProfileChange: (profile: ProfileData) => void;
  personNumber: number;
  profile: ProfileData;
  onSave?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  title, 
  onProfileChange, 
  personNumber,
  profile,
  onSave
}) => {
  const [newInterest, setNewInterest] = useState('');

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    const updatedProfile = { ...profile, [field]: value };
    onProfileChange(updatedProfile);
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      const updatedInterests = [...profile.interests, newInterest.trim()];
      handleInputChange('interests', updatedInterests);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    const updatedInterests = profile.interests.filter(i => i !== interest);
    handleInputChange('interests', updatedInterests);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="scrapbook-card bg-white p-6 w-full max-w-md"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide">{title}</h3>
        {onSave && (
          <motion.button
            onClick={onSave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold uppercase text-sm"
          >
            Save
          </motion.button>
        )}
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-1 uppercase">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter full name"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-1 uppercase">Age</label>
          <input
            type="number"
            min="16"
            max="100"
            value={profile.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-1 uppercase">Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., New York, NY"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-1 uppercase">Company</label>
          <input
            type="text"
            value={profile.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="e.g., Tech Corp"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-1 uppercase">Interests</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add interest"
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-colors text-sm"
            />
            <button
              onClick={addInterest}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold text-sm uppercase"
            >
              Add
            </button>
          </div>
          
          {/* Interest Tags */}
          <div className="flex flex-wrap gap-1">
            {profile.interests.map((interest) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs font-bold uppercase"
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="text-pink-600 hover:text-pink-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            {profile.interests.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                Add interests to find perfect events
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};