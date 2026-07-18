import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Users, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const communities = [
  {
    name: 'Code Collective',
    members: '2,847',
    posts: '1,200+ posts today',
    desc: 'Developers sharing code, asking questions, and building together.',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-500',
    tags: ['JavaScript', 'React', 'Python'],
  },
  {
    name: 'Gaming Hub',
    members: '4,123',
    posts: '3,500+ posts today',
    desc: 'Find teammates, share wins, discuss the latest releases.',
    color: 'from-violet-400 to-purple-500',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-500',
    tags: ['FPS', 'RPG', 'Indie'],
  },
  {
    name: 'Music Scene',
    members: '1,896',
    posts: '800+ posts today',
    desc: 'Local bands, concert meetups, and playlist sharing.',
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-500',
    tags: ['Live Shows', 'Vinyl', 'Production'],
  },
  {
    name: 'Photo Walks',
    members: '963',
    posts: '400+ posts today',
    desc: 'Organize photo walks, share your best shots, get feedback.',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-500',
    tags: ['Street', 'Portrait', 'Landscape'],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function CommunityPreview() {
  return (
    <section id="communities" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink tracking-tight mb-4"
        >
          Find your people
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-gray-400 text-lg max-w-lg"
        >
          Active communities with real conversations happening right now.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {communities.map((c) => (
          <motion.div
            key={c.name}
            variants={cardVariant}
            whileHover={{ y: -4 }}
            className="group relative rounded-2xl border border-gray-200/60 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300/60 flex flex-col"
          >
            <div className={`${c.bgColor} p-6 flex items-center justify-center h-32 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className={`w-3.5 h-3.5 ${c.textColor}`} />
                <span className={`text-xs font-medium ${c.textColor}`}>{c.posts}</span>
              </div>

              <h3 className="text-lg font-display font-bold text-ink mb-1">{c.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{c.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {c.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400">{c.members} members</span>
                </div>
                <span className="text-xs font-semibold text-pink-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Join <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <Link to="/communities">
          <Button variant="secondary" size="lg" className="px-8 text-base">
            View All Communities
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
