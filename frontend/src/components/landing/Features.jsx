import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Shield, MapPin, MessageCircle, Lock, Users, Zap, Eye, Globe } from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cellVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] } },
};

export default function Features() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section id="features" ref={ref} className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto relative">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-400/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600 mb-4"
        >
          <Zap className="w-3.5 h-3.5" />
          Features
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight leading-[1.1] mb-4"
        >
          Built for anonymous<br />communities
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.04 }}
          className="text-[15px] text-gray-400 max-w-md"
        >
          Every feature designed to keep your identity safe while you connect with your city.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10"
      >
        {/* Hero card - Anonymous Identity */}
        <motion.div
          variants={cellVariant}
          className="md:col-span-2 md:row-span-2 rounded-2xl bg-gradient-to-br from-ink to-gray-800 overflow-hidden relative group"
        >
          <motion.div style={{ y: bgY }} className="absolute top-0 right-0 w-[250px] h-[250px] bg-pink-500/[0.08] rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-violet-500/[0.05] rounded-full blur-[60px]" />

          <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-white/[0.08] border border-white/[0.06] flex items-center justify-center mb-6">
                <Shield className="w-5 h-5 text-pink-400" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-display font-extrabold text-white mb-3 leading-tight">
                Anonymous<br />Identity
              </h3>
              <p className="text-[14px] text-gray-400 max-w-sm leading-relaxed">
                Get a unique name like Fox-7281. No real name, no tracking, no data selling. Your identity stays yours.
              </p>
            </div>

            <div className="mt-8">
              <div className="bg-white/[0.06] rounded-2xl border border-white/[0.08] p-5 backdrop-blur-sm max-w-xs">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" alt="Fox-7281" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">Fox-7281</p>
                    <p className="text-[10px] text-gray-500">Online now</p>
                  </div>
                </div>
                <p className="text-[12px] text-gray-400 leading-relaxed">Your real identity is never stored, shared, or sold. Period.</p>
              </div>
              <div className="flex items-center gap-3 mt-5">
                {['No real name', 'No tracking', 'No data selling'].map((tag) => (
                  <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Local Communities */}
        <motion.div
          variants={cellVariant}
          className="rounded-2xl border border-gray-200/60 bg-white overflow-hidden group hover:shadow-lg hover:border-gray-300/60 transition-all duration-300"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors">
              <MapPin className="w-5 h-5 text-pink-500" />
            </div>
            <h3 className="text-base font-display font-bold text-ink mb-1.5">Local Communities</h3>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-4">Join city-based communities and connect with people nearby.</p>

            <div className="mt-auto space-y-1.5">
              {[
                { name: 'Downtown', count: '3,200' },
                { name: 'Midtown', count: '1,800' },
                { name: 'Uptown', count: '950' },
              ].map((city) => (
                <div key={city.name} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                  <span className="text-[13px] font-medium text-ink">{city.name}</span>
                  <span className="text-[11px] text-gray-400">{city.count} members</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Real-time Chat */}
        <motion.div
          variants={cellVariant}
          className="rounded-2xl border border-gray-200/60 bg-white overflow-hidden group hover:shadow-lg hover:border-gray-300/60 transition-all duration-300"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors">
              <MessageCircle className="w-5 h-5 text-pink-500" />
            </div>
            <h3 className="text-base font-display font-bold text-ink mb-1.5">Real-time Chat</h3>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-4">WebSocket-powered instant messaging. Zero latency.</p>

            <div className="mt-auto space-y-2">
              <div className="flex gap-1.5 items-end">
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-2.5 py-1.5">
                  <p className="text-[9px] text-gray-600">Anyone for coffee?</p>
                </div>
              </div>
              <div className="flex gap-1.5 items-end justify-end">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl rounded-br-md px-2.5 py-1.5">
                  <p className="text-[9px]">I am in!</p>
                </div>
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Private & Secure - wide */}
        <motion.div
          variants={cellVariant}
          className="md:col-span-3 rounded-2xl border border-gray-200/60 bg-white overflow-hidden group hover:shadow-lg hover:border-gray-300/60 transition-all duration-300"
        >
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                <Lock className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-ink mb-0.5">Private & Secure</h3>
                <p className="text-[13px] text-gray-400">End-to-end encrypted direct messages.</p>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'E2E Encrypted', icon: Lock },
                { label: 'No data selling', icon: Shield },
                { label: 'Zero logs', icon: Eye },
              ].map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink text-white text-[11px] font-medium">
                  <Icon className="w-3 h-3 text-pink-400" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Growing Fast - wide */}
        <motion.div
          variants={cellVariant}
          className="md:col-span-3 rounded-2xl border border-gray-200/60 bg-white overflow-hidden group hover:shadow-lg hover:border-gray-300/60 transition-all duration-300"
        >
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                <Globe className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-ink mb-0.5">Growing Fast</h3>
                <p className="text-[13px] text-gray-400">Live in 5+ cities and expanding every month.</p>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex flex-wrap gap-2">
              {[
                { label: '5+ Cities', icon: MapPin },
                { label: '10K+ Users', icon: Users },
                { label: 'Real People', icon: Users },
              ].map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink text-white text-[11px] font-medium">
                  <Icon className="w-3 h-3 text-pink-400" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
