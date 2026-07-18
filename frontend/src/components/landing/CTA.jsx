import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Shield, MapPin, MessageCircle, Users, Zap } from 'lucide-react';
import Button from '../ui/Button';

export default function CTA() {
  return (
    <section id="cta" className="py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600" />
          <div className="absolute inset-0 grid-bg-dark opacity-20" />
          <div className="absolute inset-0 noise" style={{ zIndex: 0 }} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.08] rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.05] rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src="/brandlogo.png" alt="NearbyConnect" className="h-8 mb-6 brightness-0 invert" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6">
                  Ready to meet<br />your city?
                </h2>
                <p className="text-white/80 text-base sm:text-lg max-w-md mb-10 leading-relaxed">
                  No real name required. Join anonymously and start connecting with real people in your neighborhood.
                </p>
                <Link to="/signup">
                  <Button size="lg" className="px-8 text-base bg-white text-pink-600 hover:bg-gray-50">
                    Join NearbyConnect
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>

                <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" />
                    Free forever
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" />
                    No data selling
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { icon: Shield, title: 'Anonymous', desc: 'No real names ever' },
                  { icon: MapPin, title: 'Local', desc: 'Your neighborhood' },
                  { icon: MessageCircle, title: 'Real-time', desc: 'Instant chat' },
                  { icon: Users, title: 'Community', desc: 'Find your people' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/20 bg-white/10 p-5 hover:bg-white/15 backdrop-blur-sm transition-colors"
                  >
                    <item.icon className="w-6 h-6 text-white mb-3" />
                    <h4 className="text-sm font-display font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-white/60">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
