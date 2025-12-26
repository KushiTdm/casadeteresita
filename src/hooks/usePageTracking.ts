// src/hooks/usePageTracking.ts
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as analytics from '../utils/analytics';

export const usePageTracking = () => {
  const location = useLocation();
  const prevPathRef = useRef<string>();
  
  useEffect(() => {
    // Attendre que GA soit initialisé
    const timer = setTimeout(() => {
      if (location.pathname !== prevPathRef.current) {
        console.log(`🔄 Route changed to: ${location.pathname}`);
        
        analytics.trackPageView(
          location.pathname + location.search,
          document.title
        );
        
        // Tracking spécifique pour React Router
        analytics.trackEvent('route_change', {
          from: prevPathRef.current,
          to: location.pathname,
          search: location.search,
          hash: location.hash,
        });
        
        prevPathRef.current = location.pathname;
      }
    }, 100); // Petit délai pour s'assurer que le titre est mis à jour
    
    return () => clearTimeout(timer);
  }, [location]);
  
  // Vérifier le statut GA au chargement
  useEffect(() => {
    const initTimer = setTimeout(() => {
      console.log('🔍 Initializing page tracking...');
      analytics.checkGAStatus();
    }, 2000);
    
    return () => clearTimeout(initTimer);
  }, []);
};