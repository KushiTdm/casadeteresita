// src/components/CookieConsent.tsx
import { useState, useEffect } from 'react';
import * as analytics from '../utils/analytics';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      analytics.setGAEnabled(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    analytics.setGAEnabled(true);
    analytics.trackEvent('cookie_consent', { action: 'accept' });
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie_consent', 'declined');
    analytics.setGAEnabled(false);
    analytics.trackEvent('cookie_consent', { action: 'decline' });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2D5A4A] text-white p-4 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to improve your experience and analyze site traffic. 
            By clicking "Accept", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-semibold"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 bg-[#C4A96A] hover:bg-[#A85C32] text-[#1a1a1a] rounded-lg transition-colors text-sm font-semibold"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
