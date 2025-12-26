// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as analytics from './utils/analytics';

// ✅ IMPORTANT: Initialiser GA AVANT le rendu
console.log('🚀 Initializing Google Analytics...');
console.log('📊 GA Measurement ID:', import.meta.env.VITE_GA_MEASUREMENT_ID);
console.log('🌍 Environment:', import.meta.env.MODE);
console.log('🏭 Production:', import.meta.env.PROD);

analytics.initGA();

// Test immédiat
setTimeout(() => {
  console.log('🧪 Testing GA with test event...');
  analytics.trackEvent('app_loaded', {
    environment: import.meta.env.MODE,
    timestamp: new Date().toISOString()
  });
}, 1000);

// ✅ Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker error:', error);
      });
  });
}

// ✅ Performance monitoring
if (import.meta.env.PROD && 'performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('⏱️ Performance:', {
      'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
      'Load Complete': Math.round(perfData.loadEventEnd - perfData.loadEventStart),
      'Total Time': Math.round(perfData.loadEventEnd - perfData.fetchStart)
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);