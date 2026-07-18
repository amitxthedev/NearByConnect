import { motion } from 'framer-motion';
import Globe3D from '../ui/Globe3D';

const cities = [
  { lat: 40.7128, lng: -74.006, label: 'New York', users: '4,200' },
  { lat: 51.5074, lng: -0.1278, label: 'London', users: '2,800' },
  { lat: 35.6762, lng: 139.6503, label: 'Tokyo', users: '1,600' },
  { lat: 28.6139, lng: 77.209, label: 'New Delhi', users: '3,100' },
  { lat: 48.8566, lng: 2.3522, label: 'Paris', users: '1,900' },
  { lat: -33.8688, lng: 151.2093, label: 'Sydney', users: '900' },
  { lat: 55.7558, lng: 37.6173, label: 'Moscow', users: '1,200' },
  { lat: -22.9068, lng: -43.1729, label: 'Rio', users: '800' },
  { lat: 1.3521, lng: 103.8198, label: 'Singapore', users: '1,100' },
  { lat: 37.5665, lng: 126.978, label: 'Seoul', users: '700' },
];

const cities2 = [
  { lat: 31.2304, lng: 121.4737, label: 'Shanghai', users: '2,400' },
  { lat: 25.2048, lng: 55.2708, label: 'Dubai', users: '600' },
  { lat: -34.6037, lng: -58.3816, label: 'Buenos Aires', users: '500' },
];

const allMarkers = [...cities, ...cities2].map((c) => ({
  ...c,
  size: 0.06,
}));

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function GlobeSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-ink">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg-dark" />
      <div className="absolute inset-0 noise" style={{ zIndex: 0 }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp} className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-pink-400">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                Live in 12 cities
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-[1.1] mb-5"
            >
              Your city is
              <br />
              <span className="text-pink-400">already talking.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              NearbyConnect is live in cities across the globe. Find your local community and join the conversation.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-3">
              {cities.slice(0, 5).map((city) => (
                <div
                  key={city.label}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                    <span className="text-sm font-medium text-white">{city.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">{city.users} active</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <Globe3D
              markers={allMarkers}
              size={420}
              autoRotateSpeed={0.3}
              glowIntensity={0.4}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
