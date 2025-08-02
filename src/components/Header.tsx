import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-r from-sunshine/20 to-peach/20 paper-texture"
    >
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        {/* Decorative elements */}
        <div className="absolute top-4 left-8 text-coral text-2xl animate-bounce-slow">🌟</div>
        <div className="absolute top-6 right-12 text-mint text-xl animate-pulse">💫</div>
        <div className="absolute bottom-4 left-16 text-lavender text-lg">🎈</div>
        <div className="absolute bottom-6 right-8 text-sky text-xl">🌈</div>
        
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          className="relative inline-block"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <Heart className="w-12 h-12 text-coral fill-current drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-sunshine rounded-full animate-ping"></div>
            </motion.div>
            
            <h1 className="text-6xl font-handwritten font-bold text-brown drop-shadow-sm">
              Avida
            </h1>
            
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-sunshine drop-shadow-lg" />
            </motion.div>
          </div>
          
          {/* Washi tape decoration */}
          <div className="absolute -top-3 left-1/4 right-1/4 h-6 bg-gradient-to-r from-coral/60 to-peach/60 transform -rotate-1 rounded-sm opacity-80"></div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-2xl font-playful text-brown/80 max-w-3xl mx-auto leading-relaxed"
        >
          Find magical events for you and your bestie to create unforgettable memories together! ✨
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-mint/30 border-2 border-mint/50 rounded-full text-brown font-playful text-lg shadow-lg"
        >
          <div className="w-3 h-3 bg-mint rounded-full animate-pulse"></div>
          <span>AI-Powered Magic ✨</span>
          <Star className="w-5 h-5 text-sunshine animate-spin" style={{ animationDuration: '3s' }} />
        </motion.div>
      </div>
    </motion.header>
  );
}