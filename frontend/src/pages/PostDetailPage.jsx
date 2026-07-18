import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Heart, MessageCircle, Bookmark as BookmarkIcon, Share2, Send } from 'lucide-react';
import { postApi, commentApi } from '../services/api';
import { timeAgo } from '../utils/format';
import useAppStore from '../stores/useAppStore';
import Avatar from '../components/ui/Avatar';
import SEO from '../components/seo/SEO';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAppStore();
  const [commentText, setCommentText] = useState('');

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getById(id).then(r => r.data),
    enabled: !!id,
  });

  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (post) setBookmarked(post.isBookmarked || false);
  }, [post]);

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentApi.getByPost(id, 0, 50).then(r => r.data.content || []),
    enabled: !!id,
  });

  const comments = commentsData || [];

  const likeMutation = useMutation({
    mutationFn: () => post.isLiked ? postApi.unlike(id) : postApi.like(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['post', id] }),
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => bookmarked ? postApi.unbookmark(id) : postApi.bookmark(id),
    onMutate: () => setBookmarked(!bookmarked),
    onError: () => setBookmarked(bookmarked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['post', id] }),
  });

  const commentMutation = useMutation({
    mutationFn: (content) => commentApi.create(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      setCommentText('');
    },
  });

  const toggleLike = () => likeMutation.mutate();

  const addComment = () => {
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText.trim());
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-14 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-sm font-semibold text-gray-500">Post</h1>
          </div>
        </div>
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">
          <div className="bg-white rounded-2xl border border-gray-200/60 p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gray-100" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-2 w-16 bg-gray-50 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-3/4 bg-gray-50 rounded" />
              <div className="h-3 w-1/2 bg-gray-50 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">404</div>
        <p className="text-gray-500">Post not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-pink-500 font-medium">Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title={post.title || 'Post'}
        description={post.content?.substring(0, 160) || 'View this post on NearbyConnect anonymous community.'}
        path={`/post/${id}`}
        index={false}
      />
      {/* Header */}
      <div className="sticky top-14 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-gray-500">Post</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-24">
        {/* Post */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200/60 p-5 mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Avatar emoji={post.authorAvatar} name={post.authorName} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{post.authorName}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{post.communityName}</span>
              </div>
              <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
            </div>
          </div>

          {post.title && (
            <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{post.title}</h2>
          )}

          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-5">
            {post.content}
          </div>

          {/* Image */}
          {post.mediaUrl && (
            <div className="mb-5 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
              <img
                src={post.mediaUrl}
                alt={post.title || 'Post image'}
                className="w-full h-auto max-h-96 object-cover"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Hashtags */}
          {post.hashtags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(typeof post.hashtags === 'string' ? post.hashtags.split(',').map(s => s.trim()).filter(Boolean) : Array.isArray(post.hashtags) ? post.hashtags : []).map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-pink-50 to-rose-50 text-rose-600 border border-rose-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 pt-4 border-t border-gray-100">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                post.isLiked ? 'bg-pink-50 text-pink-500' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4" fill={post.isLiked ? 'currentColor' : 'none'} />
              {post.likeCount}
            </button>
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400">
              <MessageCircle className="w-4 h-4" />
              {comments.length}
            </span>
            <button
              onClick={() => bookmarkMutation.mutate()}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                bookmarked ? 'bg-pink-50 text-pink-500' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <BookmarkIcon className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-50 transition-colors ml-auto"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Comments */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">Comments</h3>
          {commentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200/60 p-4 animate-pulse">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                  <div className="h-3 w-full bg-gray-50 rounded" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
            </div>
          ) : (
            <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl border border-gray-200/60 p-4"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <Avatar emoji={comment.authorAvatar} name={comment.authorName} size="sm" />
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-gray-900">{comment.authorName}</span>
                        <span className="text-xs text-gray-400 ml-2">{timeAgo(comment.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-pink-500 transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        {comment.likeCount}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/60 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addComment()}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 border border-gray-100 placeholder:text-gray-300"
          />
          <motion.button
            onClick={addComment}
            whileTap={{ scale: 0.92 }}
            className={`p-2.5 rounded-xl transition-colors ${
              commentText.trim() && !commentMutation.isPending
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
            disabled={!commentText.trim() || commentMutation.isPending}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
