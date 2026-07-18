import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  MapPin,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Compass,
  Users,
  MessageSquare,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import useAppStore from '../../stores/useAppStore';

const mobileNavLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Compass },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const unreadCount = useAppStore((s) => s.unreadNotifications ?? 0);
  const logout = useAppStore((s) => s.logout);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Desktop Navbar — slim utility bar */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 h-14 items-center justify-between px-6 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-200"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200/60" />

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-sm overflow-hidden">
                {user?.avatarEmoji ? <span className="text-sm">{user.avatarEmoji}</span> : <User className="w-4 h-4" strokeWidth={1.5} />}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1">
                  {user?.anonymousName || 'Anonymous'}
                </p>
                <p className="text-[11px] text-gray-400 leading-tight flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {user?.city?.name || '—'}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-gray-400 transition-transform duration-200',
                  dropdownOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl shadow-black/8 border border-gray-100 py-2 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.anonymousName || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {user?.city?.name || 'Unknown City'}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
                      onClick={() => { setDropdownOpen(false); logout(); navigate('/login'); }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar — full brand bar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center shrink-0">
            <img src="/brandlogo.png" alt="NearbyConnect" className="h-7 sm:h-8 object-contain" />
          </Link>

          <div className="flex items-center gap-1.5">
            <Link
              to="/notifications"
              className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="px-3 py-3 space-y-1">
                {mobileNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        location.pathname === link.to
                          ? 'bg-pink-50 text-pink-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
