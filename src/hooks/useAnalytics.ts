// src/hooks/useAnalytics.ts - VERSION SIMPLIFIÉE
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook pour tracker automatiquement les changements de page
 * Utilise gtag qui est déjà initialisé dans index.html
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Vérifier que gtag existe
    if (typeof window.gtag === 'undefined') {
      console.warn('⚠️ gtag not loaded');
      return;
    }

    // Track page view
    window.gtag('event', 'page_view', {
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title,
    });

    console.log('📊 Page tracked:', location.pathname);
  }, [location]);
}

/**
 * Hook pour tracker le scroll depth
 */
export function useScrollTracking(threshold = 75) {
  useEffect(() => {
    let maxScroll = 0;
    let tracked = false;

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
      }

      if (scrollPercent >= threshold && !tracked && typeof window.gtag !== 'undefined') {
        window.gtag('event', 'scroll', {
          percent_scrolled: threshold,
        });
        tracked = true;
        console.log(`📊 Scroll tracked: ${threshold}%`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
}

// Type declaration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}