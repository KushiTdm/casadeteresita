// src/hooks/useEventTracking.ts
import { useEffect, useCallback } from 'react';
import * as analytics from '../utils/analytics';

export const useEventTracking = () => {
  // Track les clics sur WhatsApp
  const trackWhatsApp = useCallback((source: string, phoneNumber?: string) => {
    analytics.trackWhatsAppClick(source, phoneNumber);
  }, []);

  // Track les vues de chambres
  const trackRoomView = useCallback((roomId: string, roomName: string, viewType: 'gallery' | 'details') => {
    analytics.trackRoomView(roomId, roomName, viewType);
  }, []);

  // Track les interactions de calendrier
  const trackDateSelection = useCallback((checkIn: string, checkOut: string, nights: number) => {
    analytics.trackDateSelection(checkIn, checkOut, nights);
  }, []);

  // Track la navigation dans les sections
  const trackSectionNavigation = useCallback((section: string, action: 'click' | 'scroll' | 'hover') => {
    analytics.trackEvent('section_interaction', {
      section,
      action,
      page_url: window.location.pathname,
    });
  }, []);

  // Track les clics sur les images
  const trackImageClick = useCallback((imageId: string, galleryName: string) => {
    analytics.trackEvent('image_click', {
      image_id: imageId,
      gallery_name: galleryName,
      page_url: window.location.pathname,
    });
  }, []);

  // Track les lectures vidéo
  const trackVideoPlay = useCallback((videoId: string, videoTitle: string) => {
    analytics.trackEvent('video_play', {
      video_id: videoId,
      video_title: videoTitle,
      page_url: window.location.pathname,
    });
  }, []);

  // Track le scroll dans les sections
  useEffect(() => {
    let scrollTracked = new Set();
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-track-section]');
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionId = section.getAttribute('data-track-section');
        
        // Si la section est visible à 50% et pas encore trackée
        if (
          sectionId && 
          !scrollTracked.has(sectionId) &&
          rect.top < window.innerHeight * 0.5 &&
          rect.bottom > window.innerHeight * 0.5
        ) {
          analytics.trackEvent('section_view', {
            section_id: sectionId,
            section_name: section.getAttribute('data-track-name') || sectionId,
            page_url: window.location.pathname,
          });
          scrollTracked.add(sectionId);
        }
      });
    };

    // Debounce pour éviter trop d'événements
    let scrollTimeout: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return {
    trackWhatsApp,
    trackRoomView,
    trackDateSelection,
    trackSectionNavigation,
    trackImageClick,
    trackVideoPlay,
  };
};