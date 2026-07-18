import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-5"
        >
          <div className="max-w-screen-xl mx-auto bg-white rounded-3xl shadow-[0_-4px_40px_rgba(0,0,0,0.08)] border border-gray-200/60 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4.5 h-4.5 text-pink-500" />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-ink mb-1">We value your privacy</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  We use cookies to improve your experience, analyze traffic, and personalize content. You can choose to accept or decline. See our{' '}
                  <a href="/privacy" className="text-pink-500 font-medium hover:underline">Privacy Policy</a> for details.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-initial px-6 py-2.5 text-[13px] font-medium text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-[0.97] transition-all"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-ink text-white text-[13px] font-semibold rounded-full hover:bg-gray-800 active:scale-[0.97] transition-all"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
