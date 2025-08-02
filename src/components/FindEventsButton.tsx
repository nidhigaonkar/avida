import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
        whileHover={!disabled && !loading ? { scale: 1.05, rotate: 0 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
        className={`
          find-events-btn relative overflow-hidden min-w-[320px]
          ${disabled || loading 
            ? 'opacity-60 cursor-not-allowed transform-none' 
            : ''
          }
        `}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Finding Perfect Events...</span>
          </div>
        ) : (
          <span>🔍 Find Events Together! 🎉</span>
        )}
      </motion.button>
      
      {disabled && !loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="handwritten text-brown text-lg mt-6 opacity-80"
        >
          Please fill out both profiles completely to find matching events ✨
        </motion.p>
      )}
    </div>
  );
};