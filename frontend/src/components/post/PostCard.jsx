import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../../services/api';
import { cn } from '../../utils/cn';
import { timeAgo } from '../../utils/format';
import Avatar from '../ui/Avatar';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  useEffect(() => {
    setIsLiked(post.isLiked || false);
    setIsBookmarked(post.isBookmarked || false);
    setLikeCount(post.likeCount || 0);
  }, [post.isLiked, post.isBookmarked, post.likeCount]);

  const likeMutation = useMutation({
    mutationFn: () => isLiked ? postApi.unlike(post.id) : postApi.like(post.id),
    onMutate: () => {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    },
    onError: () => {
      setIsLiked(isLiked);
      setLikeCount(post.likeCount || 0);
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => isBookmarked ? postApi.unbookmark(post.id) : postApi.bookmark(post.id),
    onMutate: () => {
      setIsBookmarked(!isBookmarked);
    },
    onError: () => {
      setIsBookmarked(isBookmarked);
    },
  });

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('[data-no-nav]')) return;
    navigate(`/post/${post.id}`);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    likeMutation.mutate();
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    bookmarkMutation.mutate();
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate(`/post/${post.id}`);
  };

  const mediaUrl = post.mediaUrl || post.imageUrl || post.thumbnailUrl;

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 10px 40px rgba(236, 72, 153, 0.1)' }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="relative rounded-2xl bg-white/70 backdrop-blur-xl border border-pink-100/50 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar
              emoji={post.authorAvatar}
              name={post.authorName}
              size="md"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-gray-900">{post.authorName}</span>
                <span className="text-gray-400">in</span>
                <Link
                  to={`/community/${post.communityId}`}
                  data-no-nav
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-rose-500 hover:text-rose-600 transition-colors"
                >
                  {post.communityName}
                </Link>
              </div>
              <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
            </div>
          </div>
          <button
            data-no-nav
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1.5 rounded-full hover:bg-pink-50 transition-colors text-gray-400 hover:text-pink-500"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Title */}
        {post.title && (
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug">
            {post.title}
          </h2>
        )}

        {/* Content */}
        {post.content && (
          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
            {post.content}
          </p>
        )}

        {/* Image */}
        {mediaUrl && (
          <div className="mb-3 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
            <img
              src={mediaUrl}
              alt={post.title || 'Post image'}
              className="w-full h-auto max-h-80 object-cover"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(typeof post.hashtags === 'string' ? post.hashtags.split(',').map(s => s.trim()).filter(Boolean) : Array.isArray(post.hashtags) ? post.hashtags : []).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-pink-50 to-rose-50 text-rose-600 border border-rose-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-0.5">
            {/* Like Button */}
            <motion.button
              onClick={handleLike}
              data-no-nav
              whileTap={{ scale: 0.85 }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                isLiked
                  ? "text-rose-500 bg-rose-50"
                  : "text-gray-500 hover:text-rose-500 hover:bg-rose-50"
              )}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={18}
                  className={cn(isLiked && "fill-current")}
                />
              </motion.div>
              <span>{likeCount}</span>
            </motion.button>

            {/* Comment Button */}
            <button
              onClick={handleCommentClick}
              data-no-nav
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:text-pink-500 hover:bg-pink-50 transition-all"
            >
              <MessageCircle size={18} />
              <span>{post.commentCount || 0}</span>
            </button>
          </div>

          <div className="flex items-center gap-0.5">
            {/* Bookmark Button */}
            <motion.button
              onClick={handleBookmark}
              data-no-nav
              whileTap={{ scale: 0.85 }}
              className={cn(
                "p-2 rounded-full transition-all",
                isBookmarked
                  ? "text-amber-500 bg-amber-50"
                  : "text-gray-500 hover:text-amber-500 hover:bg-amber-50"
              )}
            >
              <motion.div
                animate={isBookmarked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Bookmark
                  size={18}
                  className={cn(isBookmarked && "fill-current")}
                />
              </motion.div>
            </motion.button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              data-no-nav
              className="p-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-pink-50 transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
