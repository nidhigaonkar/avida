import React from 'react';
import { motion } from 'framer-motion';
import { ProfileForm, ProfileData } from './ProfileForm';

interface ProfileSectionProps {
  profile1: ProfileData;
  profile2: ProfileData;
  setProfile1: (profile: ProfileData) => void;
  setProfile2: (profile: ProfileData) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile1,
  profile2,
  setProfile1,
  setProfile2
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen py-20"
      id="profiles"
    >
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold handwritten text-brown mb-6 transform -rotate-1"
          >
            Create Your Profiles
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-brown/80 max-w-3xl mx-auto leading-relaxed"
          >
            Tell us about yourselves! We'll use AI to find events that perfectly match both of your interests, location, and preferences.
          </motion.p>
        </div>

        {/* Profile Forms */}
        <div className="profile-section">
          <div className="profiles-container">
            <ProfileForm
              title="Person 1"
              onProfileChange={setProfile1}
              personNumber={1}
              profile={profile1}
            />
            <ProfileForm
              title="Person 2"
              onProfileChange={setProfile2}
              personNumber={2}
              profile={profile2}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};