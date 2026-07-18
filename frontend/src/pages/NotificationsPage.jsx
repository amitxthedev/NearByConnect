import React, { useState } from 'react';
import { Heart, MessageCircle, Reply, Users, Bell, CheckCheck, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../services/api';
import { timeAgo } from '../utils/format';
import SEO from '../components/seo/SEO';

const NOTIFICATION_CONFIG = {
  like: {
    icon: Heart,
    gradient: 'from-pink-500 to-rose-500',
    fill: true,
  },
  comment: {
    icon: MessageCircle,
    gradient: 'from-blue-500 to-cyan-500',
    fill: false,
  },
  reply: {
    icon: Reply,
    gradient: 'from-violet-500 to-purple-500',
    fill: false,
  },
  message: {
    icon: MessageCircle,
    gradient: 'from-emerald-500 to-teal-500',
    fill: false,
  },
  community: {
    icon: Users,
    gradient: 'from-gray-500 to-slate-600',
    fill: false,
  },
};

const mapNotificationType = (notification) => {
  const rawType = (notification.type || notification.notificationType || '').toLowerCase();
  const typeMap = {
    like: 'like',
    comment: 'comment',
    reply: 'reply',
    message: 'message',
    community_join: 'community',
    community: 'community',
  };
  return typeMap[rawType] || 'community';
};

const NotificationItem = ({ notification, onMarkRead }) => {
  const type = mapNotificationType(notification);
  const config = NOTIFICATION_CONFIG[type];
  const Icon = config.icon;
  const actor = notification.senderName || notification.actor || 'Someone';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
      className={`relative flex items-start gap-3.5 p-4 cursor-pointer transition-all duration-200 ${
        notification.isRead
          ? 'bg-white hover:bg-gray-50'
          : 'bg-pink-50/30 hover:bg-pink-50/50'
      }`}
    >
      {!notification.isRead && (
        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-pink-500 rounded-full shadow-sm shadow-pink-300" />
      )}

      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <Icon className={`w-5 h-5 text-white ${config.fill ? 'fill-current' : ''}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-relaxed">
          <span className="font-semibold">{actor}</span>{' '}
          <span className="text-gray-500">{notification.message || 'activity'}</span>
        </p>
        {notification.content && (
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-1 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
            {notification.content}
          </p>
        )}
        <span className="text-[11px] text-gray-400 mt-1.5 block font-medium">
          {notification.createdAt ? timeAgo(notification.createdAt) : ''}
        </span>
      </div>
    </motion.div>
  );
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationApi.getAll(0, 50);
      return res.data.content || [];
    },
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const res = await notificationApi.getUnreadCount();
      return res.data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  const unreadCount = unreadCountData ?? notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return mapNotificationType(n) === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <SEO
          title="Notifications"
          description="View your latest notifications from NearbyConnect. Stay updated on community activity, messages, and interactions."
          path="/notifications"
          index={false}
        />
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-14 z-20">
          <div className="px-4 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm relative">
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-pink-500 text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm border border-pink-100">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-400">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <motion.button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="flex items-center gap-1.5 text-xs font-semibold text-pink-600 bg-pink-50 px-3.5 py-2 rounded-xl hover:bg-pink-100 transition-colors disabled:opacity-50 border border-pink-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCheck className="w-4 h-4" />
                {markAllReadMutation.isPending ? 'Marking...' : 'Mark all read'}
              </motion.button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-4 pb-3 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'like', label: 'Likes' },
              { id: 'comment', label: 'Comments' },
              { id: 'reply', label: 'Replies' },
              { id: 'message', label: 'Messages' },
              { id: 'community', label: 'Community' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.id === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 bg-white/25 px-1.5 rounded-full text-[10px]">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="bg-white">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-pink-500 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-400 mt-3 font-medium">Loading notifications...</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {filteredNotifications.map((notification, i) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <NotificationItem
                        notification={notification}
                        onMarkRead={(id) => markReadMutation.mutate(id)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gray-50 flex items-center justify-center">
                    <BellOff className="w-9 h-9 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">All caught up!</h3>
                  <p className="text-sm text-gray-400">
                    {filter === 'unread'
                      ? 'No unread notifications'
                      : `No ${filter} notifications yet`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Privacy Footer */}
        <div className="text-center py-6 px-4">
          <p className="text-[11px] text-gray-400 font-medium">
            Notifications are generated from anonymous interactions. Your real identity remains hidden.
          </p>
        </div>
      </div>
    </div>
  );
}
