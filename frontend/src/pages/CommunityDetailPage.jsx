import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Users,
  Info,
  UserPlus,
  UserMinus,
  Crown,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  MapPin,
  Sparkles,
  Loader2,
} from 'lucide-react';
import useAppStore from '../stores/useAppStore';
import { communityApi, chatApi } from '../services/api';
import SEO from '../components/seo/SEO';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { timeAgo } from '../utils/format';
import { cn } from '../utils/cn';

const tabs = [
  { key: 'members', label: 'Members', icon: Users },
  { key: 'about', label: 'About', icon: Info },
];

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('members');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [membersPage, setMembersPage] = useState(0);

  const { data: community, isLoading: communityLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communityApi.getById(id).then((r) => r.data),
  });

  const { data: membersPageData, isLoading: membersLoading } = useQuery({
    queryKey: ['community-members', id, membersPage],
    queryFn: () => communityApi.getMembers(id, membersPage, 20).then((r) => r.data),
    enabled: activeTab === 'members',
  });

  const isCreator = community?.createdBy === user?.anonymousName;

  const members = membersPageData?.content || [];

  const joinMutation = useMutation({
    mutationFn: () => communityApi.join(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community', id] }),
  });

  const leaveMutation = useMutation({
    mutationFn: () => communityApi.leave(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community', id] }),
  });

  const openChatMutation = useMutation({
    mutationFn: () => chatApi.createCommunityRoom(id),
    onSuccess: (res) => {
      const roomId = res.data?.id;
      if (roomId) navigate(`/chat/${roomId}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => communityApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      navigate('/communities');
    },
  });

  const handleJoinLeave = () => {
    if (community?.isMember) {
      leaveMutation.mutate();
    } else {
      joinMutation.mutate();
    }
  };

  if (communityLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <SEO
        title={community?.name || 'Community'}
        description={community?.description || `Join ${community?.name || 'this'} anonymous local community on NearbyConnect.`}
        path={`/community/${id}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nearbyconnect.fun/' },
            { '@type': 'ListItem', position: 2, name: 'Communities', item: 'https://nearbyconnect.fun/communities' },
            { '@type': 'ListItem', position: 3, name: community?.name || 'Community', item: `https://nearbyconnect.fun/community/${id}` },
          ],
        }}
      />
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black overflow-hidden">
        {community?.coverImage && (
          <img src={community.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl" />
          <div className="absolute bottom-4 right-4 w-56 h-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
            <Link
              to="/communities"
              className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="flex-1 min-w-0">
              {community?.interest?.name && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-white/10 rounded-full text-white/70 text-[10px] sm:text-xs font-medium backdrop-blur-sm">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {community.interest.name}
                </span>
              )}
            </div>
            {isCreator && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors backdrop-blur-sm"
                title="Delete community"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-3 leading-tight">{community?.name}</h1>
          <p className="text-white/70 text-xs sm:text-sm mb-4 sm:mb-6 max-w-xl leading-relaxed">{community?.description}</p>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1 sm:gap-1.5 text-white/80 text-xs sm:text-sm bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-semibold">{community?.memberCount?.toLocaleString()}</span>
              <span className="text-white/60">members</span>
            </div>

            {community?.isMember && (
              <motion.button
                onClick={() => openChatMutation.mutate()}
                disabled={openChatMutation.isPending}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {openChatMutation.isPending ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                {openChatMutation.isPending ? 'Opening...' : 'Open Chat'}
              </motion.button>
            )}

            <motion.button
              onClick={handleJoinLeave}
              disabled={joinMutation.isPending || leaveMutation.isPending}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300',
                community?.isMember
                  ? 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border border-white/20'
                  : 'bg-white text-gray-900 shadow-lg hover:shadow-xl',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {joinMutation.isPending || leaveMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              ) : community?.isMember ? (
                <><UserMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Leave</>
              ) : (
                <><UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Join</>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <div className="flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'relative flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.key ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {tab.label}
                {tab.key === 'members' && membersPageData?.totalElements != null && (
                  <span className="text-[10px] sm:text-xs text-gray-400">({membersPageData.totalElements})</span>
                )}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="community-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          {/* Members Tab */}
          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {membersLoading ? (
                <div className="flex justify-center py-12 sm:py-16">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-7 sm:h-7 text-gray-300" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">No members yet</p>
                  <p className="text-[10px] sm:text-xs text-gray-400">Be the first to join!</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 flex items-center gap-3 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      >
                        <Avatar
                          name={member.anonymousName}
                          src={member.anonymousAvatar}
                          emoji={member.avatarEmoji}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                            {member.anonymousName}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                            {member.city?.name && (
                              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-gray-400">
                                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                {member.city.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {membersPageData && membersPageData.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                      <button
                        onClick={() => setMembersPage((p) => Math.max(0, p - 1))}
                        disabled={membersPageData.isFirst}
                        className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">
                        Page {membersPageData.page + 1} of {membersPageData.totalPages}
                      </span>
                      <button
                        onClick={() => setMembersPage((p) => p + 1)}
                        disabled={membersPageData.isLast}
                        className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                  About this community
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{community?.description}</p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium text-gray-600 border border-gray-100">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {community?.memberCount?.toLocaleString()} members
                  </span>
                  {community?.interest?.name && (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-pink-50 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium text-pink-600 border border-pink-100">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {community.interest.name}
                    </span>
                  )}
                  {community?.city?.name && (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium text-blue-600 border border-blue-100">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {community.city.name}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium text-gray-600 border border-gray-100">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Created {community?.createdAt ? timeAgo(community.createdAt) : ''}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  Created by
                </h3>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <Avatar name={community?.createdBy} size="lg" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">{community?.createdBy}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">Community Creator</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Community">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{community?.name}</strong>? This action cannot be undone.
            All members will be removed.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete Community'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
