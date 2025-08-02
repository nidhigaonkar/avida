import React from 'react';
import { motion } from 'framer-motion';

interface InterestTagProps {
  interest: string;
  isMatching?: boolean;
  delay?: number;
}

export const InterestTag: React.FC<InterestTagProps> = ({ 
  interest, 
  isMatching = false, 
  delay = 0 
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={`
        inline-block px-3 py-1 rounded-full text-xs font-medium
        ${isMatching 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-blue-100 text-blue-800 border border-blue-200'
        }
      `}
    >
      {interest}
    </motion.span>
  );
};