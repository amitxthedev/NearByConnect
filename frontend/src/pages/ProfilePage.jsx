import React, { useState, useEffect } from 'react';
import { Settings, MapPin, Calendar, Shield, RefreshCw, Edit3, Users, MessageCircle, Heart, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { userApi, communityApi, cityApi, interestApi } from '../services/api';
import { timeAgo } from '../utils/format';
import useAppStore from '../stores/useAppStore';
import CitySelector from '../components/shared/CitySelector';
import SEO from '../components/seo/SEO';
import InterestSelector from '../components/shared/InterestSelector';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const storeUser = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const [editCity, setEditCity] = useState(null);
  const [editInterests, setEditInterests] = useState([]);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await userApi.getMe();
      return res.data;
    },
    initialData: storeUser,
    onSuccess: (data) => setUser(data),
  });

  const { data: communitiesData, isLoading: communitiesLoading } = useQuery({
    queryKey: ['userCommunities', user?.city?.id],
    queryFn: async () => {
      const res = await communityApi.getByCity(user.city.id);
      return res.data;
    },
    enabled: !!user?.city?.id,
  });

  const regenerateNameMutation = useMutation({
    mutationFn: () => userApi.regenerateName(),
    onSuccess: (res) => {
      const updated = res.data;
      setUser(updated);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const handleRegenerateName = () => {
    regenerateNameMutation.mutate();
  };

  const saveProfileMutation = useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setShowEditModal(false);
    },
  });

  const handleSaveProfile = async () => {
    const payload = {
      anonymousName: user?.anonymousName,
      bio: user?.bio,
    };
    if (editCity?.id) payload.cityId = editCity.id;
    if (editInterests.length > 0) {
      const allRes = await import('../services/api').then((m) => m.interestApi.getAll());
      const allInterests = allRes.data || [];
      payload.interestIds = allInterests
        .filter((i) => editInterests.includes(i.name))
        .map((i) => i.id);
    }
    saveProfileMutation.mutate(payload);
  };

  const communities = (communitiesData?.content || []).filter(c => c.isMember);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <SEO
        title="Profile"
        description="View and manage your anonymous NearbyConnect profile. Your identity stays private while you connect with local communities."
        path="/profile"
        index={false}
      />
      {/* Profile Header */}
      <div className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/[0.08] blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-white/[0.06] blur-2xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 pt-6 pb-20 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative inline-block"
          >
            <div className="w-32 h-32 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-6xl mx-auto border-4 border-white/20 shadow-2xl overflow-hidden">
              {user.avatarEmoji || <span className="text-6xl">?</span>}
            </div>
            <button className="absolute bottom-2 right-2 w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Edit3 className="w-4 h-4 text-gray-600" />
            </button>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-white mt-5"
          >
            {user.anonymousName}
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mt-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium">
              <MapPin className="w-3 h-3" />
              {user.city?.name}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto -mt-12 px-4 relative z-10 space-y-4">

        {/* Stats Card */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Communities', value: user.communityCount, icon: Users, gradient: 'from-pink-500 to-rose-500' },
              { label: 'Reputation', value: user.reputation?.toLocaleString(), icon: Heart, gradient: 'from-violet-500 to-purple-500' },
              { label: 'Member since', value: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: Calendar, gradient: 'from-blue-500 to-cyan-500' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                  <stat.icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div className="text-lg font-extrabold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-0.5 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-2"
        >
          <button
            onClick={() => {
              setEditCity(user.city ? { id: user.city.id, name: user.city.name } : null);
              setEditInterests(user.interests?.map((i) => i.name) || []);
              setShowEditModal(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pink-500 text-white text-sm font-semibold rounded-2xl hover:bg-pink-600 transition-colors shadow-sm shadow-pink-200"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={handleRegenerateName}
            disabled={regenerateNameMutation.isPending}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-600 text-sm font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${regenerateNameMutation.isPending ? 'animate-spin' : ''}`} />
            {regenerateNameMutation.isPending ? '...' : 'New Name'}
          </button>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Shield className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Your identity is anonymous</p>
            <p className="text-xs text-emerald-600 mt-0.5">Your real name is never shared across any interactions.</p>
          </div>
        </motion.div>

        {/* Bio & Interests */}
        {(user.bio || user.interests?.length > 0) && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            {user.bio && (
              <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
            )}
            {user.interests?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.interests.map((interest) => (
                  <span key={interest.id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-xl border border-gray-100">
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    {interest.name}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* My Communities */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
        >
          <div className="px-5 py-4 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">My Communities</h3>
              </div>
              {communities.length > 0 && (
                <Link to="/communities" className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors">
                  View all
                </Link>
              )}
            </div>
          </div>

          <div className="p-5">
            {communitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
              </div>
            ) : communities.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">No communities yet</p>
                <p className="text-xs text-gray-400 mb-4">Join a community to get started</p>
                <Link
                  to="/communities"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Browse Communities
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {communities.slice(0, 6).map((community) => (
                  <Link
                    key={community.id}
                    to={`/community/${community.id}`}
                    className="p-4 rounded-2xl border border-gray-100 text-center hover:border-gray-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <h4 className="font-semibold text-sm text-gray-800 group-hover:text-pink-600 transition-colors">{community.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      {community.memberCount?.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-5">Edit Profile</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">City</label>
                  <CitySelector
                    value={editCity?.name || null}
                    onChange={(cityName) => {
                      if (cityName) {
                        cityApi.search(cityName).then((res) => {
                          const found = (res.data || []).find((c) => c.name === cityName);
                          setEditCity(found || { name: cityName });
                        }).catch(() => setEditCity({ name: cityName }));
                      } else {
                        setEditCity(null);
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Interests</label>
                  <InterestSelector
                    value={editInterests}
                    onChange={setEditInterests}
                    placeholder="Search interests..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveProfileMutation.isPending}
                  className="flex-1 px-4 py-2.5 text-sm text-white bg-pink-500 rounded-xl hover:bg-pink-600 transition-colors font-medium shadow-sm shadow-pink-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saveProfileMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
