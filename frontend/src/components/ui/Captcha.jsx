import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const RECAPTCHA_SITE_KEY = '6LfT2lktAAAAADrCtF6qJg_5KFToPqEo7F9LdQQ4';

export default function Captcha({ onVerify }) {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const renderCaptcha = () => {
      if (!window.grecaptcha || !containerRef.current) return;
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token) => {
          setVerified(true);
          setError('');
          onVerify(token);
        },
        'expired-callback': () => {
          setVerified(false);
          onVerify(null);
        },
        'error-callback': () => {
          setVerified(false);
          setError('Captcha failed to load');
          onVerify(null);
        },
      });
      setLoaded(true);
    };

    if (window.grecaptcha) {
      renderCaptcha();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const check = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          clearInterval(check);
          renderCaptcha();
        }
      }, 100);
    };
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try { window.grecaptcha.reset(widgetIdRef.current); } catch {}
      }
    };
  }, []);

  const resetCaptcha = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
      setVerified(false);
      onVerify(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Captcha</label>
      <div ref={containerRef} className="flex justify-center" />
      {!loaded && !error && (
        <p className="text-xs text-gray-400 text-center">Loading captcha...</p>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <p className="text-xs">{error}</p>
          <button type="button" onClick={resetCaptcha} className="text-xs underline ml-auto">Retry</button>
        </div>
      )}
      {verified && (
        <div className="flex items-center gap-1.5 text-emerald-600">
          <ShieldCheck className="w-3.5 h-3.5" />
          <p className="text-xs font-medium">Verified</p>
        </div>
      )}
    </div>
  );
}
