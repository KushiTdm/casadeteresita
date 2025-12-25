// src/hooks/useAnalytics.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as analytics from '../utils/analytics';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView({
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);
}

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

      if (scrollPercent >= threshold && !tracked) {
        analytics.trackScrollDepth(threshold);
        tracked = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
}
