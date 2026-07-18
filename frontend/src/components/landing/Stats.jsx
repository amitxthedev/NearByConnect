import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, MapPin, MessageCircle, TrendingUp } from 'lucide-react';

function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;
    const startTime = performance.now();
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ''), 10);
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { target: '10000', suffix: '+', label: 'Active users', desc: 'Growing every day', icon: Users, color: 'from-pink-400 to-rose-500' },
  { target: '500', suffix: '+', label: 'Communities', desc: 'Across 5 cities', icon: MapPin, color: 'from-violet-400 to-purple-500' },
  { target: '1000000', suffix: '+', label: 'Messages sent', desc: 'Real conversations', icon: MessageCircle, color: 'from-emerald-400 to-teal-500' },
  { target: '50', suffix: '+', label: 'Cities', desc: 'And expanding', icon: TrendingUp, color: 'from-amber-400 to-orange-500' },
];

export default function Stats() {
  return (
    <section id="stats" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pink-500/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600 mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            Community
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink tracking-tight mb-4">
            Trusted by thousands
          </h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Real numbers, real people, real conversations.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="rounded-2xl border border-gray-200/60 bg-white p-6 hover:shadow-lg hover:border-gray-300/60 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight mb-1">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="text-sm font-semibold text-pink-500 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
