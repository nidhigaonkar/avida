import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Users } from 'lucide-react';

interface FindEventsButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export const FindEventsButton: React.FC<FindEventsButtonProps> = ({ onClick, disabled, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="text-center"
    >
      <motion.button
        onClick={onClick}
        disabled={disabled || loading}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={`
          relative px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300
          ${disabled || loading 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700'
          }
        `}
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <span>Finding Perfect Events...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6" />
            <span>Find Events</span>
            <Users className="w-6 h-6" />
          </div>
        )}
        
        {!disabled && !loading && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl"
            animate={{ 
              background: [
                'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))',
                'linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                'linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2))'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </motion.button>
      
      {disabled && (
        <p className="text-gray-500 text-sm mt-3">
          Please fill out both profiles to find matching events
        </p>
      )}
    </motion.div>
  );
};