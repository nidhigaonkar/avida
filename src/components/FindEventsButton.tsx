import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';

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
        whileHover={!disabled && !loading ? { scale: 1.05, rotate: 1 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
        className={`
          relative overflow-hidden px-12 py-6 font-black text-2xl uppercase tracking-wider
          ${disabled || loading 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-pink-500 text-white hover:bg-pink-600 shadow-2xl'
          }
          transition-all duration-300 transform rotate-1
          border-4 border-white
        `}
        style={{
          clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)'
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span>FINDING EVENTS...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Zap className="w-8 h-8" />
            <span>FIND EVENTS!</span>
          </div>
        )}
        
        {/* Grunge effect overlay */}
        <div className="absolute inset-0 bg-black opacity-10 mix-blend-multiply" />
      </motion.button>
      
      {disabled && !loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-pink-400 text-lg mt-6 font-bold uppercase tracking-wide"
        >
          Complete both profiles to continue
        </motion.p>
      )}
    </div>
  );
};