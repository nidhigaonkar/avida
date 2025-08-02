import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

interface FindEventsButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export const FindEventsButton: React.FC<FindEventsButtonProps> = ({ onClick, disabled, loading }) => {
  return (
    <div className="text-center py-12">
      <motion.button
        onClick={onClick}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
        className={`
          relative overflow-hidden px-12 py-4 rounded-2xl font-bold text-lg
          ${disabled || loading 
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
          }
          transition-all duration-300 shadow-lg
        `}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Finding Perfect Events...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6" />
            <span>Find Events Together!</span>
          </div>
        )}
      </motion.button>
      
      {disabled && !loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-purple-200 text-lg mt-6"
        >
          Please fill out both profiles completely to find matching events
        </motion.p>
      )}
    </div>
  );
};