import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import { Event } from '../types';
import { InterestTag } from './InterestTag';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 pr-8">
                {event.title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-primary-500" />
                <span>{event.date}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-accent-500" />
                <span>{event.location}</span>
              </div>
              
              {event.attendees && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-5 h-5 text-green-500" />
                  <span>{event.attendees} attendees</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Organizers */}
            {event.organizers && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Organizers</h3>
                <p className="text-gray-600">{event.organizers}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="flex gap-3">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                View on Luma
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};