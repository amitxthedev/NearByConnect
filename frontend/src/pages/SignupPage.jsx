import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Loader2, AlertCircle, Check, MapPin, Sparkles } from 'lucide-react';
import { userApi, cityApi, interestApi } from '../services/api';
import useAppStore from '../stores/useAppStore';
import Captcha from '../components/ui/Captcha';
import SEO from '../components/seo/SEO';
import CitySelector from '../components/shared/CitySelector';
import InterestSelector from '../components/shared/InterestSelector';

export default function SignupPage() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);

  useEffect(() => {
    interestApi.getAll()
      .then((res) => setAllInterests(res.data || []))
      .catch(() => {});
  }, []);

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!captchaVerified) { setError('Please verify the captcha'); return; }
    setError('');
    setStep(1);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const interestIds = allInterests
        .filter((i) => selectedInterests.includes(i.name))
        .map((i) => i.id);

      const res = await userApi.register({
        username: username.trim(),
        password,
        cityId: selectedCity?.id || null,
        interestIds,
        captchaToken,
      });
      const { accessToken, user } = res.data;
      localStorage.setItem('token', accessToken);
      setUser(user);
      setOnboarded(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = selectedCity && selectedInterests.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <SEO title="Sign Up" description="Create your anonymous account and start connecting with your local community. No email, no real name required." path="/signup" index={false} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6 sm:mb-8">
          <img src="/brandlogo.png" alt="NearbyConnect" className="h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-400 mt-1">Join your local anonymous community</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-pink-500 text-white ring-4 ring-pink-100' : 'bg-gray-200 text-gray-400'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {step === 0 ? (
          <form onSubmit={handleAccountSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-gray-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-gray-100 pr-10 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border transition-all ${
                  confirmPassword && password !== confirmPassword ? 'border-red-300' : 'border-gray-100'
                }`}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords don&apos;t match</p>
              )}
            </div>

            <Captcha onVerify={(token) => { setCaptchaVerified(!!token); setCaptchaToken(token); }} />

            <button
              type="submit"
              disabled={!username.trim() || !password || !confirmPassword || password !== confirmPassword}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* City Selection */}
            <div className="mb-5">
              <div className="text-center mb-3">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-0.5">Pick your city</h2>
                <p className="text-xs text-gray-400">Find communities near you</p>
              </div>
              <CitySelector
                value={selectedCity?.name || null}
                onChange={(cityName) => {
                  if (cityName) {
                    cityApi.getByCountry('').then(() => {}).catch(() => {});
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

            {/* Interest Selection */}
            <div className="mb-6">
              <div className="text-center mb-3">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-0.5">Your interests</h2>
                <p className="text-xs text-gray-400">Select at least one</p>
              </div>
              <InterestSelector
                value={selectedInterests}
                onChange={setSelectedInterests}
                placeholder="Search interests..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={loading || !canProceed}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Create Account</>
                )}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-500 font-semibold hover:text-pink-600">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
