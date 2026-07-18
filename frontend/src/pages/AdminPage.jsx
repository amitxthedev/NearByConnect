import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, MessageCircle, Shield, AlertTriangle, BarChart3, Settings, CheckCircle, XCircle, Eye, Loader2, TrendingUp, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../stores/useAppStore';
import { dashboardApi, reportApi, userApi } from '../services/api';
import SEO from '../components/seo/SEO';
import { timeAgo } from '../utils/format';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, gradient: 'from-pink-500 to-rose-500' },
  { id: 'users', label: 'Users', icon: Users, gradient: 'from-violet-500 to-purple-500' },
  { id: 'reports', label: 'Reports', icon: AlertTriangle, gradient: 'from-amber-500 to-orange-500' },
  { id: 'moderation', label: 'Moderation', icon: Shield, gradient: 'from-emerald-500 to-teal-500' },
  { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-blue-500 to-cyan-500' },
];

function StatCard({ label, value, icon: Icon, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-extrabold text-gray-900">{value}</div>
      <div className="text-xs text-gray-400 mt-1 font-medium">{label}</div>
    </motion.div>
  );
}

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    suspended: 'bg-amber-50 text-amber-600 border border-amber-200',
    banned: 'bg-red-50 text-red-600 border border-red-200',
    pending: 'bg-amber-50 text-amber-600 border border-amber-200',
    resolved: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    dismissed: 'bg-gray-50 text-gray-600 border border-gray-200',
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const user = useAppStore((s) => s.user);
  const cityId = user?.city?.id;
  const queryClient = useQueryClient();

  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard', cityId],
    queryFn: () => dashboardApi.getDashboard(cityId).then((r) => r.data),
    enabled: !!cityId,
    placeholderData: (prev) => prev,
  });

  const { data: reportsPage, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => reportApi.getAll(0, 50).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const { data: usersPage, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', searchQuery],
    queryFn: () => userApi.search(searchQuery, 0, 20).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const resolveMutation = useMutation({
    mutationFn: (id) => reportApi.resolve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reports'] }),
  });

  const dismissMutation = useMutation({
    mutationFn: (id) => reportApi.dismiss(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reports'] }),
  });

  const stats = dashboard || {};
  const reports = reportsPage?.content || [];
  const allUsers = usersPage?.content || [];

  const filteredUsers = allUsers.filter((u) => {
    if (userFilter === 'all') return true;
    return u.accountStatus?.toLowerCase() === userFilter;
  });

  const pendingReports = reports.filter((r) => r.status === 'PENDING');

  return (
    <div className="flex h-screen bg-gray-50">
      <SEO title="Admin" description="NearbyConnect administration panel." path="/admin" index={false} />
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Admin Panel</h1>
              <p className="text-[10px] text-gray-400">Management console</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeSection === item.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeSection === item.id ? 'bg-white/15' : 'bg-gray-100'
              }`}>
                <item.icon className="w-3.5 h-3.5" />
              </div>
              {item.label}
              {item.id === 'reports' && pendingReports.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingReports.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            System Operational
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Dashboard */}
          {activeSection === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              {dashboardLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard label="Total Users" value={stats.totalUsers?.toLocaleString() ?? '0'} icon={Users} gradient="from-pink-500 to-rose-500" delay={0} />
                  <StatCard label="Total Posts" value={stats.totalPosts?.toLocaleString() ?? '0'} icon={MessageCircle} gradient="from-violet-500 to-purple-500" delay={0.1} />
                  <StatCard label="Communities" value={stats.totalCommunities?.toLocaleString() ?? '0'} icon={Globe} gradient="from-blue-500 to-cyan-500" delay={0.2} />
                  <StatCard label="Online Users" value={stats.onlineUsersCount?.toLocaleString() ?? '0'} icon={Zap} gradient="from-emerald-500 to-teal-500" delay={0.3} />
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  Recent Reports
                </h3>
                <div className="space-y-3">
                  {reportsLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
                    </div>
                  ) : reports.length > 0 ? (
                    reports.slice(0, 5).map((report) => (
                      <div key={report.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-sm text-gray-700 flex-1">
                          {report.reporterName || 'User'} reported {report.reportedUserName || 'a user'}: {report.reason}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0 font-medium">{timeAgo(report.createdAt)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-6">No recent activity</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50 transition-all"
                  />
                  {['all', 'active', 'suspended', 'banned'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setUserFilter(filter)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                        userFilter === filter
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {usersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">User</th>
                          <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                          <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Reputation</th>
                          <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Posts</th>
                          <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-5 py-12 text-center">
                              <p className="text-sm font-semibold text-gray-500">No users found</p>
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                                    {u.avatarEmoji || '?'}
                                  </div>
                                  <span className="text-sm font-semibold text-gray-800">{u.anonymousName}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <StatusBadge status={u.accountStatus?.toLowerCase()} />
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-sm text-gray-700 font-semibold">{u.reputation?.toLocaleString() ?? 0}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-sm text-gray-700">{u.postCount ?? 0}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-xs text-gray-400 font-medium">{timeAgo(u.createdAt)}</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Reports Section */}
          {activeSection === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>
              {reportsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-emerald-50 flex items-center justify-center">
                        <CheckCircle className="w-9 h-9 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">No reports</h3>
                      <p className="text-sm text-gray-400">Nothing to review right now</p>
                    </div>
                  ) : (
                    reports.map((report, i) => {
                      const isPending = report.status === 'PENDING';
                      return (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow ${
                            isPending ? 'border-l-4 border-l-amber-400' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <StatusBadge status={report.status?.toLowerCase()} />
                                <span className="text-xs text-gray-400 font-medium">{timeAgo(report.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-gray-800">{report.reporterName || 'Anonymous'}</span>
                                <span className="text-xs text-gray-400">reported</span>
                                <span className="text-sm font-bold text-gray-800">{report.reportedUserName || 'Unknown'}</span>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <span className="text-xs font-bold text-gray-600 bg-white px-2 py-0.5 rounded-lg border border-gray-100">{report.reason}</span>
                                {report.content && (
                                  <p className="text-sm text-gray-600 mt-2">{report.content}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          {isPending && (
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => resolveMutation.mutate(report.id)}
                                disabled={resolveMutation.isPending}
                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50 border border-emerald-200"
                              >
                                <CheckCircle className="w-4 h-4" />
                                {resolveMutation.isPending ? 'Resolving...' : 'Resolve'}
                              </button>
                              <button
                                onClick={() => dismissMutation.mutate(report.id)}
                                disabled={dismissMutation.isPending}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 border border-gray-200"
                              >
                                <XCircle className="w-4 h-4" />
                                {dismissMutation.isPending ? 'Dismissing...' : 'Dismiss'}
                              </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Moderation */}
          {activeSection === 'moderation' && (
            <motion.div
              key="moderation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Moderation</h2>
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">All clear!</h3>
                <p className="text-sm text-gray-400">No flagged content to review</p>
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeSection === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Settings</h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Content Moderation',
                    desc: 'Automatically flag posts with reported keywords',
                    enabled: true,
                    gradient: 'from-pink-500 to-rose-500',
                    icon: Shield,
                  },
                  {
                    title: 'Auto-suspend on 5+ Reports',
                    desc: 'Automatically suspend users who receive 5 or more reports',
                    enabled: true,
                    gradient: 'from-violet-500 to-purple-500',
                    icon: AlertTriangle,
                  },
                  {
                    title: 'Require Email Verification',
                    desc: 'New users must verify email before posting',
                    enabled: false,
                    gradient: 'from-blue-500 to-cyan-500',
                    icon: Eye,
                  },
                  {
                    title: 'Allow User Reports',
                    desc: 'Let users report content and other users',
                    enabled: true,
                    gradient: 'from-emerald-500 to-teal-500',
                    icon: Users,
                  },
                  {
                    title: 'Anonymous Admin Mode',
                    desc: 'Admin actions appear without revealing admin status',
                    enabled: true,
                    gradient: 'from-amber-500 to-orange-500',
                    icon: Shield,
                  },
                ].map((setting, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${setting.gradient} flex items-center justify-center shadow-sm`}>
                        <setting.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{setting.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{setting.desc}</p>
                      </div>
                    </div>
                    <button
                      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                        setting.enabled ? 'bg-pink-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                          setting.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
