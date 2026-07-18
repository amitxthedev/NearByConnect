import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Filter,
  Users,
  ArrowLeft,
  Plus,
  TrendingUp,
  Sparkles,
  X,
  Loader2,
} from 'lucide-react';
import useAppStore from '../stores/useAppStore';
import { communityApi, interestApi } from '../services/api';
import CommunityCard from '../components/community/CommunityCard';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import SEO from '../components/seo/SEO';

const filters = [
  { key: 'all', label: 'All', icon: Filter },
  { key: 'yours', label: 'Your Communities', icon: Users },
  { key: 'trending', label: 'Trending', icon: TrendingUp },
  { key: 'new', label: 'New', icon: Sparkles },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function CommunitiesPage() {
  const { user } = useAppStore();
  const cityId = user?.city?.id;
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createInterestId, setCreateInterestId] = useState('');

  const { data: communitiesData, isLoading } = useQuery({
    queryKey: ['communities', cityId],
    queryFn: () => communityApi.getByCity(cityId, 0, 100).then((r) => r.data),
    enabled: !!cityId,
  });

  const { data: interestsData } = useQuery({
    queryKey: ['interests'],
    queryFn: () => interestApi.getAll().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => communityApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      setShowCreateModal(false);
      setCreateName('');
      setCreateDescription('');
      setCreateInterestId('');
    },
  });

  const communities = communitiesData?.content || [];
  const interests = interestsData || [];

  const filteredCommunities = useMemo(() => {
    if (!communities.length) return [];
    let result = communities;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    switch (activeFilter) {
      case 'yours':
        return result.filter((c) => c.isMember);
      case 'trending':
        return [...result].sort((a, b) => b.memberCount - a.memberCount);
      case 'new':
        return [...result].reverse();
      default:
        return result;
    }
  }, [communities, activeFilter, searchQuery]);

  const handleCreate = () => {
    if (!createName.trim()) return;
    createMutation.mutate({
      name: createName.trim(),
      description: createDescription.trim() || null,
      interestId: createInterestId ? Number(createInterestId) : null,
    });
  };

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <SEO
        title="Communities"
        description="Browse and join anonymous local communities in your city. Discover groups based on your interests and location on NearbyConnect."
        path="/communities"
        keywords="local communities, anonymous groups, join community, nearby groups, interest-based communities"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Communities — NearbyConnect',
          description: 'Browse and join anonymous local communities in your city.',
          url: 'https://nearbyconnect.fun/communities',
        }}
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="h-12 sm:h-14 flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-50 text-gray-500 hover:text-pink-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                Communities in {user?.city?.name || 'Your City'}
              </h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-pink-500 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-md shadow-pink-200 hover:shadow-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Search */}
        <div className="relative mb-4 sm:mb-5">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === f.key
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-pink-500'
              }`}
            >
              <f.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {f.label}
            </button>
          ))}
        </div>

        {/* Community count */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{filteredCommunities.length}</span>{' '}
            communities found
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-20 sm:h-24 bg-gray-100" />
                <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 w-32 bg-gray-100 rounded" />
                  <div className="h-2.5 sm:h-3 w-full bg-gray-50 rounded" />
                  <div className="h-2.5 sm:h-3 w-2/3 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCommunities.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No communities found"
            description="Try a different search or filter"
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {filteredCommunities.map((community) => (
                <motion.div
                  key={community.id}
                  variants={item}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <CommunityCard community={community} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Create Community Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Community">
        <div className="space-y-4">
          <Input
            label="Community Name"
            placeholder="e.g. Mumbai Coders"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            maxLength={100}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              placeholder="What is this community about?"
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Interest (optional)</label>
            <select
              value={createInterestId}
              onChange={(e) => setCreateInterestId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all duration-200"
            >
              <option value="">Select an interest</option>
              {interests.map((interest) => (
                <option key={interest.id} value={interest.id}>
                  {interest.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!createName.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Create Community'
              )}
            </Button>
          </div>
          {createMutation.isError && (
            <p className="text-xs text-red-500 mt-1">
              {createMutation.error?.response?.data?.message || 'Failed to create community'}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
