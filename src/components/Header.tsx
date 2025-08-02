import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Calendar } from 'lucide-react';

interface HeaderProps {
  onGetStarted: () => void;
}

export default function Header({ onGetStarted }: HeaderProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center py-6 px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-sunshine to-coral rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-2xl font-bold text-brown">Avida</span>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onGetStarted}
          className="px-6 py-2 bg-sunshine text-brown font-semibold rounded-full hover:bg-sunshine/90 transition-colors"
        >
          Get Started
        </motion.button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-brown mb-6 leading-tight">
              Find Perfect Events
              <br />
              <span className="text-coral">Together</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-brown/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered event matching that finds amazing experiences based on your shared interests, location, and preferences
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-sunshine to-peach text-brown font-bold text-lg rounded-full hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Start Matching Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-8 py-4 border-2 border-brown text-brown font-semibold text-lg rounded-full hover:bg-brown hover:text-cream transition-all duration-300">
              See How It Works
            </button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-sky/30 transform rotate-1 hover:rotate-0 transition-transform">
              <div className="w-12 h-12 bg-sky rounded-full flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-brown mb-2">AI-Powered Matching</h3>
              <p className="text-brown/70 text-sm">Smart algorithms find events that match both of your interests perfectly</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-coral/30 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-brown mb-2">Perfect for Pairs</h3>
              <p className="text-brown/70 text-sm">Designed specifically for finding events that both people will love</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-mint/30 transform rotate-1 hover:rotate-0 transition-transform">
              <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-brown mb-2">Real Events</h3>
              <p className="text-brown/70 text-sm">Curated from Luma and other platforms with direct booking links</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce opacity-20">🎉</div>
      <div className="absolute top-40 right-20 text-3xl animate-pulse opacity-20">✨</div>
      <div className="absolute bottom-40 left-20 text-3xl animate-bounce opacity-20 animation-delay-1000">🎈</div>
      <div className="absolute bottom-20 right-10 text-4xl animate-pulse opacity-20 animation-delay-2000">💫</div>
    </div>
  );
}