import React from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-10 relative"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ scale: 1, rotate: -2 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
        className="relative inline-block mb-6"
      >
        <h1 className="text-6xl font-bold handwritten text-brown relative" style={{ textShadow: '3px 3px 0px rgba(255, 215, 0, 0.3)' }}>
          Avida
          <span className="absolute -top-2 -right-5 text-3xl text-coral animate-bounce">♡</span>
        </h1>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-2xl handwritten text-brown mb-4 transform rotate-1"
      >
        Find magical events for you and your bestie to create unforgettable memories together!
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="handwritten text-coral text-xl flex items-center justify-center gap-3"
      >
        <span style={{ animation: 'twinkle 1.5s ease-in-out infinite alternate' }}>✨</span>
        <span>Scrapbook Magic</span>
        <span style={{ animation: 'twinkle 1.5s ease-in-out infinite alternate' }}>✨</span>
      </motion.div>
    </motion.header>
  );
}