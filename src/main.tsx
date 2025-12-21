// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ✅ ENREGISTRER LE SERVICE WORKER
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker enregistré:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Erreur Service Worker:', error);
      });
  });
}

// ✅ MONITORING DE PERFORMANCE (optionnel)
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

// ✅ Structure simplifiée - tous les providers sont dans App.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);