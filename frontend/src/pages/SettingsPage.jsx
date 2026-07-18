import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check, Loader2, ArrowLeft, User, Bell, Shield, Palette,
  RefreshCw, LogOut, Moon, MapPin, Sparkles,
} from 'lucide-react';
import useAppStore from '../stores/useAppStore';
import { userApi, cityApi } from '../services/api';
import SEO from '../components/seo/SEO';
import CitySelector from '../components/shared/CitySelector';

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-pink-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAppStore();

  const [selectedCity, setSelectedCity] = useState(user?.city ? { id: user.city.id, name: user.city.name } : null);
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    chat: true,
  });
  const [privacy, setPrivacy] = useState({
    showOnline: true,
    allowDMs: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleRegenerateName = () => {
    const adjectives = ['Cosmic', 'Mystic', 'Radiant', 'Swift', 'Brave', 'Gentle', 'Wild', 'Lunar', 'Silent', 'Crimson'];
    const animals = ['Fox', 'Wolf', 'Bear', 'Owl', 'Cat', 'Deer', 'Hawk', 'Lynx', 'Raven', 'Tiger'];
    const num = Math.floor(Math.random() * 9000) + 1000;
    const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${animals[Math.floor(Math.random() * animals.length)]}-${num}`;
    setUser({ ...user, anonymousName: name });
  };

  const handleSignOut = () => {
    if (logout) logout();
    navigate('/');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const payload = {
        anonymousName: user?.anonymousName,
      };
      if (selectedCity?.id) payload.cityId = selectedCity.id;
      await userApi.updateProfile(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      key: 'account',
      title: 'Account',
      icon: User,
      gradient: 'from-pink-500 to-rose-500',
      delay: 0.05,
    },
    {
      key: 'notifications',
      title: 'Notifications',
      icon: Bell,
      gradient: 'from-violet-500 to-purple-500',
      delay: 0.1,
    },
    {
      key: 'privacy',
      title: 'Privacy',
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-500',
      delay: 0.15,
    },
    {
      key: 'appearance',
      title: 'Appearance',
      icon: Palette,
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.2,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Settings" description="Manage your NearbyConnect account settings." path="/settings" index={false} />
      <div className="sticky top-14 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Account</h2>
              <p className="text-xs text-gray-400">Manage your anonymous identity</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">Anonymous Name</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 font-semibold border border-gray-100">
                  {user?.anonymousName || 'Not set'}
                </div>
                <button
                  onClick={handleRegenerateName}
                  className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all shrink-0 border border-gray-100"
                  title="Regenerate name"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">City</label>
              <CitySelector
                value={selectedCity?.name || null}
                onChange={(cityName) => {
                  if (cityName) {
                    cityApi.search(cityName).then((res) => {
                      const found = (res.data || []).find((c) => c.name === cityName);
                      setSelectedCity(found || { name: cityName });
                    }).catch(() => setSelectedCity({ name: cityName }));
                  } else {
                    setSelectedCity(null);
                  }
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">Avatar</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-2xl">
                  {user?.avatar || user?.avatarEmoji || <User className="w-5 h-5 text-gray-400" />}
                </div>
                <span className="text-xs text-gray-400">Your anonymous avatar</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-400">Control what you get notified about</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'push', label: 'Push Notifications', desc: 'Get notified about likes, comments, and messages' },
              { key: 'email', label: 'Email Notifications', desc: 'Receive weekly digest via email' },
              { key: 'chat', label: 'Chat Notifications', desc: 'Alerts for new direct messages' },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{n.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                </div>
                <Toggle
                  enabled={notifications[n.key]}
                  onChange={(val) => setNotifications((prev) => ({ ...prev, [n.key]: val }))}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Privacy</h2>
              <p className="text-xs text-gray-400">Control who can reach you</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'showOnline', label: 'Show Online Status', desc: 'Others can see when you are active' },
              { key: 'allowDMs', label: 'Allow Direct Messages', desc: 'Anyone can send you a direct message' },
            ].map((p) => (
              <div key={p.key} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
                </div>
                <Toggle
                  enabled={privacy[p.key]}
                  onChange={(val) => setPrivacy((prev) => ({ ...prev, [p.key]: val }))}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Appearance</h2>
              <p className="text-xs text-gray-400">Customize the look and feel</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Dark Mode</p>
                <p className="text-xs text-gray-400 mt-0.5">Coming soon</p>
              </div>
            </div>
            <Toggle enabled={darkMode} onChange={setDarkMode} />
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all duration-300 disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : saved ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : (
              'Save Changes'
            )}
          </button>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-red-500 text-sm font-bold border border-red-100 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>

        <div className="text-center pb-6 pt-2">
          <p className="text-[11px] text-gray-300 font-medium">NearbyConnect v1.0</p>
        </div>
      </div>
    </div>
  );
}
