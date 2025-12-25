// src/utils/analytics.ts
// ==========================================
// 🔧 Configuration & Types
// ==========================================

interface AnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  debug: boolean;
}

interface PageViewParams {
  page_title: string;
  page_location: string;
  page_path: string;
  language?: string;
}

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

// Configuration
const GA_CONFIG: AnalyticsConfig = {
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  enabled: import.meta.env.PROD, // Désactivé en dev par défaut
  debug: import.meta.env.DEV,
};

// ==========================================
// 🚀 Initialization
// ==========================================

/**
 * Initialize Google Analytics
 * Appeler cette fonction au démarrage de l'app
 */
export function initGA(): void {
  if (!GA_CONFIG.enabled || !GA_CONFIG.measurementId) {
    console.log('📊 GA: Disabled in development');
    return;
  }

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_CONFIG.measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA_CONFIG.measurementId, {
    send_page_view: false, // On gère les page views manuellement
    cookie_flags: 'SameSite=None;Secure',
  });

  console.log('✅ GA Initialized:', GA_CONFIG.measurementId);
}

// ==========================================
// 📄 Page Tracking
// ==========================================

/**
 * Track page views
 */
export function trackPageView(params: Partial<PageViewParams> = {}): void {
  if (!GA_CONFIG.enabled) return;

  const pageParams: PageViewParams = {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    language: document.documentElement.lang,
    ...params,
  };

  window.gtag?.('event', 'page_view', pageParams);

  if (GA_CONFIG.debug) {
    console.log('📊 GA Page View:', pageParams);
  }
}

// ==========================================
// 🎯 Event Tracking
// ==========================================

/**
 * Track generic event
 */
export function trackEvent(eventName: string, params: EventParams = {}): void {
  if (!GA_CONFIG.enabled) return;

  window.gtag?.('event', eventName, params);

  if (GA_CONFIG.debug) {
    console.log(`📊 GA Event: ${eventName}`, params);
  }
}

// ==========================================
// 🏨 Hotel-Specific Events
// ==========================================

/**
 * Track room view
 */
export function trackRoomView(roomId: string, roomName: string, price: number): void {
  trackEvent('view_item', {
    item_id: roomId,
    item_name: roomName,
    item_category: 'Room',
    price: price,
    currency: 'USD',
  });
}

/**
 * Track date selection
 */
export function trackDateSelection(
  checkIn: Date,
  checkOut: Date,
  nights: number,
  roomId?: string
): void {
  trackEvent('select_dates', {
    check_in: checkIn.toISOString(),
    check_out: checkOut.toISOString(),
    nights: nights,
    room_id: roomId,
  });
}

/**
 * Track price check
 */
export function trackPriceCheck(
  roomId: string,
  totalPrice: number,
  nights: number,
  avgPricePerNight: number
): void {
  trackEvent('view_price', {
    room_id: roomId,
    total_price: totalPrice,
    nights: nights,
    avg_price_per_night: avgPricePerNight,
    currency: 'USD',
  });
}

/**
 * Track WhatsApp booking initiation
 */
export function trackWhatsAppBooking(
  roomId: string,
  roomName: string,
  totalPrice?: number,
  nights?: number
): void {
  trackEvent('begin_checkout', {
    method: 'WhatsApp',
    room_id: roomId,
    room_name: roomName,
    value: totalPrice,
    nights: nights,
    currency: 'USD',
  });
}

/**
 * Track contact attempts
 */
export function trackContact(method: 'whatsapp' | 'email' | 'phone', source: string): void {
  trackEvent('contact', {
    method: method,
    source: source,
  });
}

// ==========================================
// 📰 Content Engagement
// ==========================================

/**
 * Track blog post view
 */
export function trackBlogView(
  slug: string,
  title: string,
  category: string,
  readingTime: number
): void {
  trackEvent('view_blog_post', {
    content_id: slug,
    content_name: title,
    content_category: category,
    reading_time: readingTime,
  });
}

/**
 * Track blog share
 */
export function trackBlogShare(slug: string, title: string, method: string): void {
  trackEvent('share', {
    content_type: 'blog_post',
    content_id: slug,
    content_name: title,
    method: method,
  });
}

/**
 * Track museum artwork view
 */
export function trackArtworkView(slug: string, title: string, category: string): void {
  trackEvent('view_museum_item', {
    content_id: slug,
    content_name: title,
    content_category: category,
  });
}

/**
 * Track museum tour request
 */
export function trackMuseumTourRequest(): void {
  trackEvent('request_tour', {
    tour_type: 'museum',
  });
}

// ==========================================
// 🔍 Search & Filter
// ==========================================

/**
 * Track search
 */
export function trackSearch(searchTerm: string, resultCount: number): void {
  trackEvent('search', {
    search_term: searchTerm,
    result_count: resultCount,
  });
}

/**
 * Track filter usage
 */
export function trackFilter(filterType: string, filterValue: string): void {
  trackEvent('filter', {
    filter_type: filterType,
    filter_value: filterValue,
  });
}

// ==========================================
// 📱 Social Engagement
// ==========================================

/**
 * Track social link click
 */
export function trackSocialClick(platform: string, location: string): void {
  trackEvent('social_click', {
    platform: platform,
    location: location,
  });
}

// ==========================================
// 🎯 Conversion Tracking
// ==========================================

/**
 * Track booking conversion (à utiliser quand confirmé)
 */
export function trackBookingConversion(
  roomId: string,
  roomName: string,
  totalPrice: number,
  nights: number
): void {
  // Purchase event for GA4
  trackEvent('purchase', {
    transaction_id: `booking_${Date.now()}`,
    value: totalPrice,
    currency: 'USD',
    items: [{
      item_id: roomId,
      item_name: roomName,
      item_category: 'Room',
      quantity: nights,
      price: totalPrice / nights,
    }],
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: number): void {
  trackEvent('scroll', {
    percent_scrolled: depth,
  });
}

// ==========================================
// 🔧 Advanced Features
// ==========================================

/**
 * Set user properties
 */
export function setUserProperty(propertyName: string, value: string): void {
  if (!GA_CONFIG.enabled) return;
  
  window.gtag?.('set', 'user_properties', {
    [propertyName]: value,
  });
}

/**
 * Track timing
 */
export function trackTiming(
  name: string,
  value: number,
  category?: string,
  label?: string
): void {
  trackEvent('timing_complete', {
    name: name,
    value: value,
    event_category: category,
    event_label: label,
  });
}

/**
 * Track error
 */
export function trackError(error: Error, context?: string): void {
  trackEvent('exception', {
    description: error.message,
    fatal: false,
    context: context,
  });
}

// ==========================================
// 🎨 E-commerce Enhanced (Optional)
// ==========================================

/**
 * Track item list view
 */
export function trackItemListView(items: Array<{
  id: string;
  name: string;
  price: number;
  category?: string;
}>): void {
  trackEvent('view_item_list', {
    item_list_id: 'rooms',
    item_list_name: 'Available Rooms',
    items: items.map((item, index) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category || 'Room',
      price: item.price,
      index: index,
    })),
  });
}

// ==========================================
// 📊 Debug Helpers
// ==========================================

/**
 * Get current GA config
 */
export function getGAConfig(): AnalyticsConfig {
  return { ...GA_CONFIG };
}

/**
 * Enable/disable GA
 */
export function setGAEnabled(enabled: boolean): void {
  GA_CONFIG.enabled = enabled;
  console.log(`📊 GA ${enabled ? 'enabled' : 'disabled'}`);
}

// ==========================================
// 🌐 Type Declarations
// ==========================================

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default {
  init: initGA,
  trackPageView,
  trackEvent,
  trackRoomView,
  trackDateSelection,
  trackPriceCheck,
  trackWhatsAppBooking,
  trackContact,
  trackBlogView,
  trackBlogShare,
  trackArtworkView,
  trackMuseumTourRequest,
  trackSearch,
  trackFilter,
  trackSocialClick,
  trackBookingConversion,
  trackScrollDepth,
  setUserProperty,
  trackTiming,
  trackError,
  trackItemListView,
  getGAConfig,
  setGAEnabled,
};

