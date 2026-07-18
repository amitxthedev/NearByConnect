import { motion } from 'framer-motion';
import {
  MessageCircle, Users, MapPin, Shield, Lock, Zap, Globe, Heart,
  Sparkles, Hash, Coffee, Music, Camera, Gamepad2, BookOpen, Code, Palette,
  Utensils, Dumbbell, Plane, Headphones, Mic, Video, Send, Bell, Star,
} from 'lucide-react';

const avatars = [
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', alt: 'Ava' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', alt: 'Max' },
  { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', alt: 'Sara' },
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', alt: 'Jake' },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', alt: 'Mia' },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', alt: 'Leo' },
  { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face', alt: 'Zoe' },
];

const stats = [
  { value: '10K+', label: 'Active Users', icon: Users },
  { value: '50+', label: 'Communities', icon: MessageCircle },
  { value: '5', label: 'Cities', icon: MapPin },
  { value: '24/7', label: 'Always Live', icon: Zap },
];

const row1Items = [
  { icon: Code, label: 'Coding' },
  { icon: Gamepad2, label: 'Gaming' },
  { icon: Music, label: 'Music' },
  { icon: Camera, label: 'Photography' },
  { icon: Coffee, label: 'Meetups' },
  { icon: Palette, label: 'Art' },
  { icon: BookOpen, label: 'Books' },
  { icon: Headphones, label: 'Podcasts' },
  { icon: Utensils, label: 'Food' },
  { icon: Dumbbell, label: 'Fitness' },
  { icon: Plane, label: 'Travel' },
  { icon: Mic, label: 'Open Mic' },
  { icon: Video, label: 'Streaming' },
  { icon: Globe, label: 'Global' },
  { icon: Star, label: 'Trending' },
  { icon: Heart, label: 'Community' },
];

const row2Items = [
  { icon: Send, label: 'Chat' },
  { icon: Bell, label: 'Alerts' },
  { icon: Hash, label: 'Topics' },
  { icon: Users, label: 'Groups' },
  { icon: Shield, label: 'Safe' },
  { icon: Lock, label: 'Private' },
  { icon: Sparkles, label: 'Discover' },
  { icon: MapPin, label: 'Local' },
  { icon: MessageCircle, label: 'Threads' },
  { icon: Globe, label: 'Network' },
  { icon: Zap, label: 'Fast' },
  { icon: Star, label: 'Popular' },
  { icon: Heart, label: 'Favorites' },
  { icon: Coffee, label: 'Social' },
  { icon: Code, label: 'Dev' },
  { icon: Music, label: 'Live' },
];

function MarqueeRow({ items, direction = 'left' }) {
  const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      <div className={`flex ${animClass} whitespace-nowrap py-2`}>
        {[...items, ...items, ...items].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 mx-4 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-100 shrink-0 hover:bg-pink-50 hover:border-pink-100 transition-colors duration-300 group"
            >
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors" strokeWidth={2} />
              <span className="text-xs font-semibold text-gray-500 group-hover:text-pink-600 transition-colors whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="relative py-16 overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Avatar stack + counter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="relative mb-5">
            <div className="flex -space-x-3">
              {avatars.map((avatar, i) => (
                <motion.div
                  key={i}
                  className="w-10 h-10 rounded-full border-[2.5px] border-white overflow-hidden shadow-md"
                  style={{ zIndex: 7 - i }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.2, zIndex: 20 }}
                >
                  <img src={avatar.url} alt={avatar.alt} className="w-full h-full object-cover" loading="lazy" />
                </motion.div>
              ))}
            </div>
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-pink-400/20 via-rose-400/20 to-violet-400/20 blur-lg -z-10 animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 text-center">
            <span className="font-bold text-gray-900">10,000+</span> members across{' '}
            <span className="font-bold text-gray-900">5</span> cities and growing
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="text-center py-5 px-3 rounded-2xl bg-gray-50/80 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Auto-scrolling marquee rows */}
        <div className="space-y-3">
          <MarqueeRow items={row1Items} direction="left" />
          <MarqueeRow items={row2Items} direction="right" />
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10"
        >
          {[
            { icon: Lock, label: 'End-to-end encrypted' },
            { icon: Shield, label: 'Anonymous by design' },
            { icon: Zap, label: 'Real-time messaging' },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <badge.icon className="w-3.5 h-3.5 text-pink-400" />
              {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
