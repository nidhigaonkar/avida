import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, MapPin } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="text-3xl"
              >
                🎯
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 text-3xl opacity-40"
              >
                🎯
              </motion.div>
            </div>
          </motion.div>
          
          <h1 className="text-5xl font-bold gradient-text">
            Avida
          </h1>
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 text-3xl opacity-30"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Find the perfect events for you and your friend to attend together with
          <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {' '}AI-powered matching
          </span>
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center items-center gap-6 mt-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-500" />
            <span>Dual Profiles</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>Smart Matching</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span>Live Events</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Ready to Match Events
        </motion.div>
      </div>
    </motion.header>
  );
}