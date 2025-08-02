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
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  title, 
  onProfileChange, 
  personNumber,
  profile 
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
      className="profile-card"
    >
      <h3 className="profile-title">{title}</h3>
      <p className="profile-subtitle">Fill out your profile details</p>

      <div className="space-y-5">
        {/* Name */}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="form-input"
          />
        </div>

        {/* Age */}
        <div className="form-group">
          <label className="form-label">Age</label>
          <input
            type="number"
            min="16"
            max="100"
            value={profile.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
            className="form-input"
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">📍 Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., New York, NY"
            className="form-input"
          />
        </div>

        {/* Company */}
        <div className="form-group">
          <label className="form-label">🏢 Company/Organization</label>
          <input
            type="text"
            value={profile.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="e.g., Tech Corp"
            className="form-input"
          />
        </div>

        {/* Interests */}
        <div className="interests-section">
          <label className="form-label">Interests & Hobbies</label>
          <div className="interests-input-container">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add an interest (e.g., cooking, hiking)"
              className="form-input add-interest-input"
            />
            <button
              onClick={addInterest}
              className="add-btn"
            >
              + Add
            </button>
          </div>
          
          {/* Interest Tags */}
          <div className="interests-container">
            {profile.interests.map((interest, index) => (
              <motion.div
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
                  className="remove-interest"
                >
                  ×
                </button>
              </motion.div>
            ))}
            {profile.interests.length === 0 && (
              <p className="helper-text">
                Add interests to help us find perfect events for you! ✨
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};