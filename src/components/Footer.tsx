import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brown text-cream py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-sunshine to-coral rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-2xl font-bold handwritten">Avida</span>
            </div>
            <p className="text-cream/80 leading-relaxed">
              Bringing people together through perfectly matched events and shared experiences.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h3 className="text-xl font-bold handwritten mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-cream/80 hover:text-sunshine transition-colors">How It Works</a>
              <a href="#" className="block text-cream/80 hover:text-sunshine transition-colors">Privacy Policy</a>
              <a href="#" className="block text-cream/80 hover:text-sunshine transition-colors">Terms of Service</a>
              <a href="#" className="block text-cream/80 hover:text-sunshine transition-colors">Contact Us</a>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center md:text-right"
          >
            <h3 className="text-xl font-bold handwritten mb-4">Connect With Us</h3>
            <div className="flex gap-4 justify-center md:justify-end">
              <a href="#" className="w-10 h-10 bg-cream/20 rounded-full flex items-center justify-center hover:bg-sunshine transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-cream/20 rounded-full flex items-center justify-center hover:bg-sunshine transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-cream/20 rounded-full flex items-center justify-center hover:bg-sunshine transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-cream/20 mt-12 pt-8 text-center"
        >
          <p className="text-cream/60 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-coral fill-current" /> for bringing people together
          </p>
          <p className="text-cream/40 text-sm mt-2">
            © 2025 Avida. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};