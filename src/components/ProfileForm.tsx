import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: personNumber * 0.2 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-purple-200">Fill out your profile details</p>
        </div>
        {onSave && (
          <motion.button
            onClick={onSave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
          >
            Save
          </motion.button>
        )}
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Age</label>
          <input
            type="number"
            min="16"
            max="100"
            value={profile.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">📍 Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., New York, NY"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">🏢 Company/Organization</label>
          <input
            type="text"
            value={profile.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="e.g., Tech Corp"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Interests & Hobbies</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add an interest (e.g., cooking, hiking)"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={addInterest}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Add
            </button>
          </div>
          
          {/* Interest Tags */}
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full text-sm font-medium"
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="ml-1 text-white hover:text-red-200 transition-colors"
                >
                  ×
                </button>
              </motion.div>
            ))}
            {profile.interests.length === 0 && (
              <p className="text-purple-300 text-sm italic">
                Add interests to help us find perfect events for you! ✨
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};