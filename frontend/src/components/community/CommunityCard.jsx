import { Users, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';
import { getInterestIcon } from '../../utils/interestIcons';

const interestGradients = {
  technology: 'from-blue-500 to-indigo-600',
  gaming: 'from-purple-500 to-violet-600',
  sports: 'from-orange-500 to-red-600',
  music: 'from-pink-500 to-rose-600',
  food: 'from-amber-500 to-orange-600',
  travel: 'from-teal-500 to-cyan-600',
  fitness: 'from-green-500 to-emerald-600',
  art: 'from-fuchsia-500 to-pink-600',
  photography: 'from-sky-500 to-blue-600',
  books: 'from-indigo-500 to-purple-600',
  movies: 'from-red-500 to-rose-600',
  default: 'from-rose-500 to-pink-600',
};

export default function CommunityCard({ community }) {
  const {
    id,
    name,
    description,
    memberCount,
    postCount,
    isMember,
    interest,
  } = community;

  const interestName = typeof interest === 'string' ? interest : interest?.name || '';
  const gradient = interestGradients[interestName?.toLowerCase()] || interestGradients.default;
  const Icon = getInterestIcon(interest);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg border border-gray-100"
    >
      <Link to={`/community/${id}`} className="block">
        {/* Gradient Header */}
        <div className={cn("relative h-20 sm:h-24 bg-gradient-to-r", gradient, "flex items-center justify-center")}>
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white/90" strokeWidth={1.5} />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Name */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {name}
          </h3>

          {/* Member Count */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
            <Users size={12} className="text-rose-400 sm:w-3.5 sm:h-3.5" />
            <span className="font-medium">{memberCount?.toLocaleString() || 0} members</span>
            <span className="text-gray-300">•</span>
            <span>{postCount || 0} posts</span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
            {description}
          </p>

          {/* Join/Leave Button */}
          <Button
            variant={isMember ? 'outline' : 'primary'}
            size="sm"
            className={cn(
              "w-full text-xs sm:text-sm",
              isMember
                ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-sm"
            )}
          >
            {isMember ? (
              <>
                <Check size={14} className="mr-1 sm:mr-1.5 sm:w-4 sm:h-4" />
                Joined
              </>
            ) : (
              <>
                Join Community
                <ArrowRight size={14} className="ml-1 sm:ml-1.5 sm:w-4 sm:h-4" />
              </>
            )}
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
