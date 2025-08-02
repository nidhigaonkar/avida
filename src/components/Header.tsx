import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="relative">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0"
              >
                <Heart className="w-8 h-8 text-red-300 fill-current opacity-50" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Avida
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Find perfect events for you and your friend to attend together
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            AI-Powered Event Matching
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}