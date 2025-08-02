import React from 'react';
import { motion } from 'framer-motion';
import { Users, Brain, Calendar, Heart } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Users,
      title: "Create Profiles",
      description: "Both people fill out their interests, location, and preferences",
      color: "sky"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our smart algorithm finds events that match your combined interests",
      color: "coral"
    },
    {
      icon: Calendar,
      title: "Get Matches",
      description: "Receive personalized event recommendations with compatibility scores",
      color: "mint"
    },
    {
      icon: Heart,
      title: "Attend Together",
      description: "Book your perfect events and create amazing memories together",
      color: "peach"
    }
  ];

  return (
    <div className="py-20 bg-white/50">
      <div className="max-w-6xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold handwritten text-brown mb-6 transform -rotate-1">
            How It Works
          </h2>
          <p className="text-xl text-brown/80 max-w-2xl mx-auto">
            Finding perfect events for you and your friend is as easy as 1, 2, 3, 4!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`
                bg-white p-8 rounded-2xl border-2 shadow-lg
                ${index % 2 === 0 ? 'transform rotate-1' : 'transform -rotate-1'}
                hover:rotate-0 transition-all duration-300 hover:shadow-xl
                ${step.color === 'sky' ? 'border-sky' : 
                  step.color === 'coral' ? 'border-coral' :
                  step.color === 'mint' ? 'border-mint' : 'border-peach'}
              `}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto
                ${step.color === 'sky' ? 'bg-sky' : 
                  step.color === 'coral' ? 'bg-coral' :
                  step.color === 'mint' ? 'bg-mint' : 'bg-peach'}
              `}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold handwritten text-brown mb-2">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-brown mb-3">
                  {step.title}
                </h3>
                <p className="text-brown/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};