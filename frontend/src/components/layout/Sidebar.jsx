import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  MessageSquare,
  Users,
  Bell,
  Bookmark,
  User,
  Settings,
  MapPin,
  Compass,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import useAppStore from '../../stores/useAppStore';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ open, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const city = useAppStore((s) => s.user?.city?.name ?? 'Your City');
  const user = useAppStore((s) => s.user);
  const unreadCount = useAppStore((s) => s.unreadNotifications ?? 0);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed top-14 left-0 bottom-0 z-40 bg-white border-r border-gray-100 transition-all duration-300 flex flex-col',
          collapsed ? 'w-[68px]' : 'w-64',
          'hidden lg:flex'
        )}
      >
        {/* Nav links */}
        <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const hasNotif = link.to === '/notifications' && unreadCount > 0;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 relative',
                    collapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5',
                    isActive
                      ? 'bg-pink-50/80 text-pink-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  )
                }
                title={collapsed ? link.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-r-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div className="relative shrink-0">
                      <Icon
                        className={cn(
                          'w-[18px] h-[18px] transition-colors duration-200',
                          isActive ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-600'
                        )}
                      />
                      {hasNotif && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    {!collapsed && <span className="truncate">{link.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-100 px-2.5 py-3 space-y-1">
          {/* Settings (separated from main nav) */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 relative',
                collapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5',
                isActive
                  ? 'bg-pink-50/80 text-pink-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              )
            }
            title={collapsed ? 'Settings' : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Settings
                  className={cn(
                    'w-[18px] h-[18px] shrink-0 transition-colors',
                    isActive ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-600'
                  )}
                />
                {!collapsed && <span>Settings</span>}
              </>
            )}
          </NavLink>

          {/* City + Collapse */}
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="truncate">{city}</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center w-full rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200',
              collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
            )}
          >
            <ChevronLeft
              className={cn(
                'w-[18px] h-[18px] shrink-0 transition-transform duration-300',
                collapsed && 'rotate-180'
              )}
            />
            {!collapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile slide-in sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-2xl shadow-black/10 flex flex-col lg:hidden"
          >
            {/* Mobile sidebar header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  NearbyConnect
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile user info */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-sm overflow-hidden">
                  {user?.avatarEmoji ? <span className="text-xl">{user.avatarEmoji}</span> : <User className="w-5 h-5" strokeWidth={1.5} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.anonymousName || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {user?.city?.name || 'Unknown City'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile nav links */}
            <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-pink-50/80 text-pink-600'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                      )
                    }
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile bottom */}
            <div className="border-t border-gray-100 px-2.5 py-3 space-y-1">
              <NavLink
                to="/settings"
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-pink-50/80 text-pink-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  )
                }
              >
                <Settings className="w-[18px] h-[18px] shrink-0" />
                <span>Settings</span>
              </NavLink>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
