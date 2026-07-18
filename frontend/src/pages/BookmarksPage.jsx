import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../services/api';
import PostCard from '../components/post/PostCard';

const ArrowLeft = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const BookmarkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
);

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

function SkeletonCard() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-pink-100/50 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 bg-gray-200 rounded-full" />
          <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 w-full bg-gray-100 rounded-full" />
        <div className="h-3 w-4/5 bg-gray-100 rounded-full" />
        <div className="h-3 w-3/5 bg-gray-100 rounded-full" />
      </div>
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
        <div className="h-2.5 w-12 bg-gray-100 rounded-full" />
        <div className="h-2.5 w-12 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

export default function BookmarksPage() {
  const queryClient = useQueryClient();
  const [page] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookmarks', page],
    queryFn: () => postApi.getBookmarks(page, 20).then((res) => res.data),
  });

  const bookmarks = data?.content ?? [];
  const totalCount = data?.totalElements ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-14 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Bookmarks</h1>
          {!isLoading && totalCount > 0 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
              {totalCount}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-24">
            <p className="text-sm text-gray-400">Failed to load bookmarks.</p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['bookmarks'] })}
              className="mt-4 px-5 py-2.5 bg-pink-500 text-white text-sm font-medium rounded-xl hover:bg-pink-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-4">
              <BookmarkIcon className="w-10 h-10 text-pink-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No bookmarks yet</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
              Save posts you find interesting and they will appear here for quick access.
            </p>
            <Link
              to="/feed"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-pink-500 text-white text-sm font-medium rounded-xl hover:bg-pink-600 transition-colors"
            >
              Explore Feed
            </Link>
          </motion.div>
        ) : (
          <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
            <AnimatePresence mode="popLayout">
              {bookmarks.map((post) => (
                <motion.div
                  key={post.id}
                  variants={item}
                  exit="exit"
                  layout
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
