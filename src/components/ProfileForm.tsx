import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

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
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ title, onProfileChange, personNumber }) => {
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
      transition={{ duration: 0.6, delay: personNumber * 0.2 }}
      className="profile-card"
    >
      <h3 className="text-2xl handwritten text-brown mb-4 text-center">
        {title}
      </h3>
      <p className="handwritten text-coral text-center mb-6 text-lg">
        Fill out your profile details
      </p>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block handwritten text-lg text-brown mb-2 relative">
            Full Name
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-sunshine to-transparent"></span>
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border-2 border-lavender rounded-xl focus:border-sunshine focus:ring-0 focus:scale-105 transition-all duration-300 bg-white"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block handwritten text-lg text-brown mb-2 relative">
            Age
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-sunshine to-transparent"></span>
          </label>
          <input
            type="number"
            min="16"
            max="100"
            value={profile.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
            className="w-full px-4 py-3 border-2 border-lavender rounded-xl focus:border-sunshine focus:ring-0 focus:scale-105 transition-all duration-300 bg-white"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block handwritten text-lg text-brown mb-2 relative">
            📍 Location
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-sunshine to-transparent"></span>
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., New York, NY"
            className="w-full px-4 py-3 border-2 border-lavender rounded-xl focus:border-sunshine focus:ring-0 focus:scale-105 transition-all duration-300 bg-white"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block handwritten text-lg text-brown mb-2 relative">
            🏢 Company/Organization
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-sunshine to-transparent"></span>
          </label>
          <input
            type="text"
            value={profile.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="e.g., Tech Corp"
            className="w-full px-4 py-3 border-2 border-lavender rounded-xl focus:border-sunshine focus:ring-0 focus:scale-105 transition-all duration-300 bg-white"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block handwritten text-lg text-brown mb-2 relative">
            Interests & Hobbies
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-sunshine to-transparent"></span>
          </label>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add an interest (e.g., cooking, hiking)"
              className="flex-1 px-4 py-3 border-2 border-lavender rounded-xl focus:border-sunshine focus:ring-0 focus:scale-105 transition-all duration-300 bg-white"
            />
            <button
              onClick={addInterest}
              className="px-5 py-3 bg-gradient-to-r from-sunshine to-peach border-0 rounded-xl handwritten font-semibold text-brown hover:scale-105 transition-all duration-300 transform -rotate-1 hover:rotate-0 shadow-lg"
            >
              + Add
            </button>
          </div>
          
          {/* Interest Tags */}
          <div className="flex flex-wrap gap-3 min-h-[60px] p-4 bg-white/50 rounded-xl border-2 border-dashed border-softgray">
            {profile.interests.map((interest, index) => (
              <motion.span
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="interest-tag"
                style={{
                  background: index % 3 === 0 
                    ? 'linear-gradient(135deg, #FF7F7F, #FFCBA4)'
                    : index % 3 === 1 
                    ? 'linear-gradient(135deg, #87CEEB, #E6E6FA)'
                    : 'linear-gradient(135deg, #98FB98, #87CEEB)'
                }}
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="bg-white/30 rounded-full w-5 h-5 flex items-center justify-center text-white font-bold hover:bg-white/50 transition-colors"
                >
                  ×
                </button>
              </motion.span>
            ))}
            {profile.interests.length === 0 && (
              <p className="handwritten text-brown text-center w-full opacity-60 py-2">
                Add interests to help us find perfect events for you! ✨
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};