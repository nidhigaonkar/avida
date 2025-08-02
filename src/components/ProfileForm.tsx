import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Building, Plus, X } from 'lucide-react';

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
  gradient: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ title, onProfileChange, gradient }) => {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    age: 18,
    location: '',
    company: '',
    interests: []
  });
  const [newInterest, setNewInterest] = useState('');

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
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
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
          <User className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-500">Fill out your profile details</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Age
          </label>
          <input
            type="number"
            min="16"
            max="100"
            value={profile.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., New York, NY"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Building className="w-4 h-4 inline mr-2" />
            Company/Organization
          </label>
          <input
            type="text"
            value={profile.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="e.g., Tech Corp"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Interests & Hobbies
          </label>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add an interest (e.g., coffee, hiking, tech)"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
            />
            <button
              onClick={addInterest}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          
          {/* Interest Tags */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {profile.interests.map((interest, index) => (
              <motion.span
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </div>
          
          {profile.interests.length === 0 && (
            <p className="text-gray-400 text-sm italic mt-2">
              Add interests to help us find perfect events for you!
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};