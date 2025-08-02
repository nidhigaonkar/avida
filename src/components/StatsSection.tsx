import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Zap } from 'lucide-react';

interface StatsSectionProps {
  totalEvents: number;
  matchedEvents: number;
  cities: string[];
}

export default function StatsSection({ totalEvents, matchedEvents, cities }: StatsSectionProps) {
  const stats = [
    {
      icon: Calendar,
      label: 'Total Events',
      value: totalEvents.toLocaleString(),
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
    },
    {
      icon: Zap,
      label: 'AI Matches',
      value: matchedEvents.toString(),
      color: 'text-accent-500',
      bgColor: 'bg-accent-100',
    },
    {
      icon: MapPin,
      label: 'Cities',
      value: cities.length.toString(),
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: Users,
      label: 'People Matched',
      value: '2',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          className="glass-card rounded-xl p-4 text-center hover:shadow-lg transition-all duration-200"
        >
          <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}