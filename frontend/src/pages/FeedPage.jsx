import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, Clock, FileText } from 'lucide-react';
import useAppStore from '../stores/useAppStore';
import { postApi } from '../services/api';
import PostCard from '../components/post/PostCard';
import SEO from '../components/seo/SEO';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FeedPage() {
  const { user } = useAppStore();
  const cityId = user?.city?.id;
  const [activeFilter, setActiveFilter] = useState('trending');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['feed', activeFilter, cityId],
    queryFn: () => {
      if (activeFilter === 'latest') {
        return postApi.getFeed(cityId, 0, 20).then(r => r.data.content || []);
      }
      return postApi.getTrending(cityId, 0, 20).then(r => r.data.content || []);
    },
    enabled: !!cityId,
  });

  const filters = [
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'latest', label: 'Latest', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Feed" description="Discover trending and latest posts from your local anonymous communities on NearbyConnect." path="/feed" index={false} />
      <div className="sticky top-14 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Feed</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === f.key
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                  : 'bg-white text-gray-500 border border-gray-200/60 hover:bg-gray-50'
              }`}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200/60 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100" />
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                    <div className="h-2 w-16 bg-gray-50 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-3/4 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-pink-50 flex items-center justify-center">
              <FileText className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No posts yet</h3>
            <p className="text-sm text-gray-400">Join communities to see posts in your feed</p>
          </motion.div>
        ) : (
          <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
            {posts?.map((post) => (
              <motion.div key={post.id} variants={item}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
