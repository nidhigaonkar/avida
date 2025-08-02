import React from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Sparkles } from 'lucide-react';

interface FindEventsButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export const FindEventsButton: React.FC<FindEventsButtonProps> = ({ onClick, disabled, loading }) => {
  return (
    <div className="text-center py-8">
      <motion.button
        onClick={onClick}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        className={`
          relative px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 min-w-[280px]
          ${disabled || loading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:from-blue-700 hover:to-purple-700'
          }
        `}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Finding Perfect Events...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Search className="w-6 h-6" />
            <span>Find Events Together</span>
            <Sparkles className="w-6 h-6" />
          </div>
        )}
      </motion.button>
      
      {disabled && !loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-sm mt-4"
        >
          Please fill out both profiles completely to find matching events
        </motion.p>
      )}
    </div>
  );
};