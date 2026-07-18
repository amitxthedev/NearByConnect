import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  MessageCircle, Users, Bell, TrendingUp, MapPin, ArrowRight,
  ChevronRight, Globe, Search, Zap, Sparkles, ArrowUpRight,
} from 'lucide-react';
import useAppStore from '../stores/useAppStore';
import { dashboardApi, chatApi } from '../services/api';
import { cn } from '../utils/cn';
import { getInterestIcon } from '../utils/interestIcons';
import SEO from '../components/seo/SEO';

function useAnimatedNumber(target, duration = 1200) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView || target === 0) { setDisplay(target); return; }
    const controls = animate(motionVal, target, {
      duration: duration / 1000,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [target, inView, duration, motionVal, rounded]);
  return [display, ref];
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

const communityGradients = [
  'from-pink-500 to-rose-500', 'from-violet-500 to-purple-500',
  'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500', 'from-fuchsia-500 to-pink-500',
];

function CommunityCard({ community, idx }) {
  const Icon = getInterestIcon(community.interest);
  return (
    <Link
      to={`/community/${community.id}`}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 rounded-2xl transition-all duration-200 group -mx-1"
    >
      <div className={cn(
        'w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm',
        'group-hover:scale-110 transition-transform duration-300',
        communityGradients[idx % communityGradients.length]
      )}>
        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-pink-600 transition-colors">{community.name}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <Users className="w-3 h-3" />
          {(community.memberCount || 0).toLocaleString()} members
        </p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-pink-400 transition-all" />
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAppStore();
  const cityId = user?.city?.id;
  const greeting = getGreeting();
  const firstName = user?.anonymousName?.split('-')[0] || 'there';

  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ['dashboard', cityId],
    queryFn: () => dashboardApi.getDashboard(cityId).then((r) => r.data),
    enabled: !!cityId,
    staleTime: 30_000,
  });

  const { data: chatRoomsData, isLoading: chatLoading } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: () => chatApi.getRooms().then((r) => r.data),
    staleTime: 30_000,
  });

  const chatRooms = Array.isArray(chatRoomsData) ? chatRoomsData : chatRoomsData?.content || [];
  const trendingCommunities = dashboard?.trendingCommunities || [];

  const [statTotal, statTotalRef] = useAnimatedNumber(dashboard?.totalUsers || 0);
  const [statOnline, statOnlineRef] = useAnimatedNumber(dashboard?.onlineUsersCount || 0);
  const [statCommunities, statCommunitiesRef] = useAnimatedNumber(dashboard?.totalCommunities || 0);

  return (
    <div className="px-3 sm:px-5 lg:px-8 py-4 sm:py-5 space-y-4 sm:space-y-5 max-w-2xl mx-auto">
      <SEO title="Dashboard" description="Your NearbyConnect dashboard. See what's happening in your local communities." path="/dashboard" />

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 p-4 sm:p-6"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-white/[0.08] blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-white/[0.06] blur-2xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        <div className="relative">
          {/* Top row: logo + greeting + online dot */}
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="flex items-center gap-2">
              <img src="/brandlogo.png" alt="NearbyConnect" className="h-6 sm:h-7 object-contain" />
              <p className="text-white/70 text-[10px] sm:text-xs font-semibold">{greeting}</p>
            </div>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/15 rounded-full backdrop-blur-sm border border-white/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-white/90">Online</span>
            </div>
          </div>

          {/* Name */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight mb-0.5 sm:mb-1">
            Hey, {firstName}
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-5">
            What is happening in <span className="text-white/90 font-semibold">{user?.city?.name || 'your city'}</span> today?
          </p>

          {/* Quick stats inline */}
          <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-[10px] sm:text-xs mb-3 sm:mb-5">
            {dashboard?.totalUsers > 0 && (
              <span className="flex items-center gap-1 bg-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="font-bold">{dashboard.totalUsers}</span> people
              </span>
            )}
            {dashboard?.totalCommunities > 0 && (
              <span className="flex items-center gap-1 bg-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="font-bold">{dashboard.totalCommunities}</span> groups
              </span>
            )}
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/profile" className="shrink-0">
              <div className="relative">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 text-base sm:text-xl overflow-hidden">
                  {user?.avatarEmoji || '?'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-pink-500" />
              </div>
            </Link>
            <Link to="/search" className="flex-1">
              <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/12 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/50 shrink-0" />
                <span className="text-white/50 text-xs sm:text-sm">Search people, communities...</span>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions — 3 cards */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { to: '/chat', icon: MessageCircle, label: 'Chats', gradient: 'from-blue-500 to-cyan-500' },
          { to: '/communities', icon: Users, label: 'Groups', gradient: 'from-pink-500 to-rose-500' },
          { to: '/notifications', icon: Bell, label: 'Alerts', gradient: 'from-amber-500 to-orange-500' },
        ].map((item) => (
          <motion.div key={item.to} variants={fadeUp}>
            <Link to={item.to} className="block">
              <div className="rounded-2xl bg-white border border-gray-100 p-4 text-center hover:shadow-lg hover:shadow-gray-100/60 hover:-translate-y-0.5 transition-all duration-300">
                <div className={cn(
                  'w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-2.5',
                  'shadow-sm group-hover:scale-110 transition-all duration-300',
                  item.gradient
                )}>
                  <item.icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-800">{item.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Stats — horizontal row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2.5 sm:gap-3"
      >
        {[
          { icon: Users, value: statTotal, ref: statTotalRef, label: 'People', gradient: 'from-pink-500 to-rose-500' },
          { icon: Zap, value: statOnline, ref: statOnlineRef, label: 'Online', gradient: 'from-emerald-500 to-teal-500' },
          { icon: TrendingUp, value: statCommunities, ref: statCommunitiesRef, label: 'Groups', gradient: 'from-orange-500 to-amber-500' },
        ].map((s) => (
          <div key={s.label} ref={s.ref} className="rounded-2xl bg-white border border-gray-100 p-3.5 sm:p-4 text-center hover:shadow-md transition-shadow">
            <div className={cn(
              'w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mx-auto mb-2 shadow-sm',
              s.gradient
            )}>
              <s.icon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 tabular-nums">{s.value}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Recent Chats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            Recent Chats
          </h3>
          {chatRooms.length > 0 && (
            <Link to="/chat" className="text-xs font-semibold text-pink-500 hover:text-pink-600 flex items-center gap-0.5 transition-colors">
              Open chat <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {chatLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-gray-100">
                <div className="w-11 h-11 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-3 w-48 bg-gray-50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : chatRooms.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-8 sm:p-10 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-blue-300" />
            </div>
            <p className="text-sm font-bold text-gray-800 mb-1">No chats yet</p>
            <p className="text-xs text-gray-400 mb-4 max-w-[200px] mx-auto">Join a community and start chatting</p>
            <Link
              to="/communities"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Browse Communities
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
            {chatRooms.slice(0, 5).map((room, idx) => (
              <Link
                key={room.id}
                to={`/chat/${room.id}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors group",
                  idx < chatRooms.slice(0, 5).length - 1 && "border-b border-gray-50"
                )}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-sm">
                  {room.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{room.name || 'Chat Room'}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {room.lastMessage?.content || room.description || 'No messages yet'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-blue-400 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Trending Communities */}
      {trendingCommunities.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              Trending
            </h3>
            <Link to="/communities" className="text-xs font-semibold text-pink-500 hover:text-pink-600 flex items-center gap-0.5 transition-colors">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
            {trendingCommunities.slice(0, 4).map((c, i) => (
              <div key={c.id} className={cn(i < Math.min(trendingCommunities.length, 4) - 1 && "border-b border-gray-50")}>
                <CommunityCard community={c} idx={i} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Explore City CTA */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Link to="/communities" className="block">
          <div className="rounded-2xl bg-white border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{user?.city?.name || 'Your City'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{dashboard?.totalUsers || 0} people nearby</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
