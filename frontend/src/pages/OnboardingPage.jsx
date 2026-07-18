import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, ArrowRight, ArrowLeft, Check, RefreshCw } from 'lucide-react';
import useAppStore from '../stores/useAppStore';
import { cityApi, interestApi, userApi } from '../services/api';
import SEO from '../components/seo/SEO';
import CitySelector from '../components/shared/CitySelector';
import InterestSelector from '../components/shared/InterestSelector';



const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

const stepTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setUser, setOnboarded } = useAppStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [allInterests, setAllInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interestApi.getAll()
      .then((res) => setAllInterests(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSteps = 4;

  const goNext = useCallback(async () => {
    if (step === 1 && !selectedCity) return;
    if (step === 2 && selectedInterests.length === 0) return;

    if (step < totalSteps - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      setIsRegistering(true);
      try {
        const interestIds = allInterests
          .filter((i) => selectedInterests.includes(i.name))
          .map((i) => i.id);

        const res = await userApi.register({
          cityId: selectedCity?.id || null,
          interestIds,
        });
        const { accessToken, user } = res.data;
        localStorage.setItem('token', accessToken);
        setUser(user);
        setOnboarded(true);
        navigate('/dashboard');
      } catch {
        setUser({
          anonymousName: user?.anonymousName || 'Anonymous',
          city: selectedCity,
          interests: selectedInterests,
        });
        setOnboarded(true);
        navigate('/dashboard');
      }
    }
  }, [step, selectedCity, selectedInterests, user, navigate, setUser, setOnboarded, allInterests]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return selectedCity !== null;
    if (step === 2) return selectedInterests.length > 0;
    if (step === 3) return true;
    return false;
  };

  const stepLabels = ['Welcome', 'Your City', 'Your Vibe', 'Your Identity'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO title="Get Started" description="Set up your anonymous profile and discover local communities." path="/onboarding" index={false} />
      {/* Top progress bar */}
      <div className="w-full px-6 pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center gap-3 mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: i === step ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    i < step
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
                      : i === step
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 ring-4 ring-pink-100'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                   {i < step ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`absolute top-1/2 left-full w-3 sm:w-6 h-0.5 -translate-y-1/2 ml-1 rounded-full transition-colors duration-500 ${
                      i < step ? 'bg-pink-400' : 'bg-gray-200'
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-xs font-semibold mt-3 tracking-wider uppercase">
            {stepLabels[step]}
          </p>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-hidden">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="welcome"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
                className="text-center"
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-gray-900 mb-4 leading-tight">
                  Welcome to NearbyConnect
                </h1>
                <p className="text-gray-400 text-lg mb-6 max-w-sm mx-auto leading-relaxed">
                  Discover, connect, and vibe with your local anonymous community
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-xs mx-auto">
                  {['Anonymous', 'Local', 'Fun'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-xl bg-gray-50 text-gray-500 text-sm font-semibold border border-gray-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <motion.button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {/* Step 1: City Selection */}
            {step === 1 && (
              <motion.div
                key="city"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
              >
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-2">Where are you from?</h2>
                  <p className="text-gray-400">Pick your city to find local communities</p>
                </div>
                <div className="max-w-md mx-auto">
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
                  {selectedCity && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-sm text-pink-500 font-semibold mt-3 flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      {selectedCity.name}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Interest Selection */}
            {step === 2 && (
              <motion.div
                key="interests"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
              >
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-2">What are you into?</h2>
                  <p className="text-gray-400">
                    Select at least one interest
                    {selectedInterests.length > 0 && (
                      <span className="ml-1 text-pink-500 font-bold">
                        ({selectedInterests.length} selected)
                      </span>
                    )}
                  </p>
                </div>
                <div className="max-w-md mx-auto">
                  <InterestSelector
                    value={selectedInterests}
                    onChange={setSelectedInterests}
                    placeholder="Search interests..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Identity Confirmation */}
            {step === 3 && (
              <motion.div
                key="identity"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-2">You're All Set!</h2>
                <p className="text-gray-400 mb-8">Ready to discover your local community</p>

                <motion.div
                  className="inline-block bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-gray-100 px-10 py-7 mb-6"
                  layout
                >
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">
                    Your username
                  </p>
                  <motion.h3
                    className="text-4xl font-display font-extrabold text-gray-900"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {user?.anonymousName || 'Anonymous'}
                  </motion.h3>
                </motion.div>

                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {selectedInterests.slice(0, 5).map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-500 text-xs font-semibold border border-gray-100"
                    >
                      {interest}
                    </span>
                  ))}
                  {selectedInterests.length > 5 && (
                    <span className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-500 text-xs font-semibold border border-gray-100">
                      +{selectedInterests.length - 5} more
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedCity?.name}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="w-full px-6 pb-8">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {step > 0 ? (
            <motion.button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-500 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          ) : (
            <div />
          )}
          {step > 0 && (
            <motion.button
              onClick={goNext}
              disabled={!canProceed() || isRegistering}
              className={`flex items-center gap-2 px-6 py-3 font-bold rounded-2xl shadow-lg transition-all duration-300 ${
                canProceed() && !isRegistering
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-200 hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
              whileHover={canProceed() && !isRegistering ? { scale: 1.04, y: -1 } : {}}
              whileTap={canProceed() && !isRegistering ? { scale: 0.97 } : {}}
            >
              {step === totalSteps - 1 ? (
                isRegistering ? (
                  <>
                    Creating your identity...
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Let us Go!
                    <Sparkles className="w-4 h-4" />
                  </>
                )
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
