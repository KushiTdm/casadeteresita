// src/components/withTracking.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as analytics from '../utils/analytics';

export function withTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function WithTrackingComponent(props: P) {
    const location = useLocation();

    useEffect(() => {
      // Track le chargement du composant
      analytics.trackEvent('component_load', {
        component_name: componentName,
        page_url: location.pathname,
      });

      return () => {
        // Track le déchargement du composant
        analytics.trackEvent('component_unload', {
          component_name: componentName,
          page_url: location.pathname,
          time_loaded: Math.round(performance.now()),
        });
      };
    }, [location.pathname, componentName]);

    // Ajouter des props de tracking
    const trackingProps = {
      ...props,
      trackEvent: analytics.trackEvent,
      trackWhatsApp: (source: string) => analytics.trackWhatsAppClick(source),
      trackRoomView: (roomId: string, roomName: string) => 
        analytics.trackRoomView(roomId, roomName, 'details'),
    };

    return <WrappedComponent {...(trackingProps as P)} />;
  };
}