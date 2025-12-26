// src/components/AnalyticsDebug.tsx
// Composant temporaire pour déboguer GA4

import { useEffect, useState } from 'react';
import * as analytics from '../utils/analytics';

export function AnalyticsDebug() {
  const [debugInfo, setDebugInfo] = useState({
    gtagLoaded: false,
    dataLayerExists: false,
    measurementId: '',
    cookieConsent: '',
    enabled: false,
  });

  useEffect(() => {
    const checkGA = () => {
      const info = {
        gtagLoaded: !!window.gtag,
        dataLayerExists: !!window.dataLayer,
        dataLayerLength: window.dataLayer?.length || 0,
        measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'NOT_SET',
        cookieConsent: localStorage.getItem('cookie_consent') || 'not_set',
        enabled: analytics.isGALoaded(),
        gtagScript: !!document.querySelector('script[src*="googletagmanager"]'),
      };
      setDebugInfo(info);
    };

    // Check immédiatement
    checkGA();

    // Re-check après 2 secondes (le temps que gtag charge)
    setTimeout(checkGA, 2000);
  }, []);

  const testEvent = () => {
    console.log('🧪 Testing GA event...');
    analytics.trackEvent('debug_test_event', {
      test: 'manual_click',
      timestamp: new Date().toISOString()
    });
    alert('Event sent! Check browser console and GA4 DebugView');
  };

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    analytics.setGAEnabled(true);
    window.location.reload();
  };

  // Ne pas afficher en production
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-2xl z-50 max-w-md text-xs font-mono">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">🔍 GA4 Debug</h3>
        <button
          onClick={() => {
            const el = document.getElementById('ga-debug');
            if (el) el.style.display = 'none';
          }}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={debugInfo.gtagLoaded ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.gtagLoaded ? '✓' : '✗'}
          </span>
          <span>gtag loaded</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={debugInfo.gtagScript ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.gtagScript ? '✓' : '✗'}
          </span>
          <span>gtag script in DOM</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={debugInfo.dataLayerExists ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.dataLayerExists ? '✓' : '✗'}
          </span>
          <span>dataLayer exists ({debugInfo.dataLayerLength} items)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={debugInfo.cookieConsent === 'accepted' ? 'text-green-400' : 'text-yellow-400'}>
            {debugInfo.cookieConsent === 'accepted' ? '✓' : '⚠'}
          </span>
          <span>Cookie consent: {debugInfo.cookieConsent}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={debugInfo.enabled ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.enabled ? '✓' : '✗'}
          </span>
          <span>GA enabled</span>
        </div>

        <div className="text-white/60 mt-2 pt-2 border-t border-white/20">
          ID: {debugInfo.measurementId}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {debugInfo.cookieConsent !== 'accepted' && (
          <button
            onClick={acceptCookies}
            className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-xs font-bold"
          >
            Accept Cookies & Reload
          </button>
        )}
        
        <button
          onClick={testEvent}
          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs font-bold"
        >
          Send Test Event
        </button>

        <button
          onClick={() => {
            console.log('=== GA4 Debug Info ===');
            console.log('window.gtag:', window.gtag);
            console.log('window.dataLayer:', window.dataLayer);
            console.log('Config:', analytics.getGAConfig());
            console.log('Cookie consent:', localStorage.getItem('cookie_consent'));
          }}
          className="w-full bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-xs font-bold"
        >
          Log to Console
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-white/20 text-white/60 text-[10px]">
        💡 Check GA4 DebugView:<br/>
        Analytics → Reports → Realtime
      </div>
    </div>
  );
}