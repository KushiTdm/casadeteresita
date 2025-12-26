// src/pages/DashboardPage.jsx - AVEC GA4 REPORTING API

import { useState, useEffect } from 'react';
import { 
  Home, LogOut, TrendingUp, Users, Eye, Clock, 
  Calendar, DollarSign, Globe, Smartphone, MapPin,
  BookOpen, Building2, MessageCircle, Star, ChevronDown,
  ChevronUp, Filter, Download, RefreshCw, AlertCircle
} from 'lucide-react';

// ... (garder LoginPage et verifyToken identiques)

// ==============================================
// 📊 GOOGLE ANALYTICS 4 API INTEGRATION
// ==============================================

const useGoogleAnalytics = (dateRange = 'last7Days') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('api'); // 'api' ou 'datalayer'

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ TENTATIVE 1: Utiliser l'API GA4 (données historiques complètes)
      console.log('🔄 Fetching analytics from GA4 API...');
      
      const response = await fetch('/.netlify/functions/fetchGA4Analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dateRange })
      });

      if (response.ok) {
        const apiData = await response.json();
        console.log('✅ Analytics loaded from GA4 API');
        setData(apiData);
        setDataSource('api');
        setLoading(false);
        return;
      } else {
        console.warn('⚠️ GA4 API unavailable, falling back to dataLayer');
        throw new Error('GA4 API unavailable');
      }

    } catch (apiError) {
      console.error('GA4 API Error:', apiError);
      
      // ✅ FALLBACK: Utiliser dataLayer (session en cours)
      try {
        console.log('🔄 Falling back to dataLayer...');
        
        if (!window.gtag || !window.dataLayer) {
          throw new Error('Google Analytics not loaded');
        }

        const dataLayerData = await getDataLayerData(dateRange);
        setData(dataLayerData);
        setDataSource('datalayer');
        setError('Using limited session data. GA4 API not configured.');
        
      } catch (dataLayerError) {
        console.error('DataLayer Error:', dataLayerError);
        setError('Unable to load analytics. Please check configuration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchAnalyticsData, dataSource };
};

// Fonction pour analyser dataLayer (fallback)
const getDataLayerData = async (dateRange) => {
  const events = window.dataLayer || [];
  
  return {
    overview: analyzeOverview(events),
    pages: analyzePages(events),
    blog: analyzeBlogPosts(events),
    museum: analyzeMuseum(events),
    conversions: analyzeConversions(events),
    timeline: analyzeTimeline(events, dateRange)
  };
};

// ... (garder toutes les fonctions analyze* existantes)

const analyzeOverview = (events) => {
  const pageViews = events.filter(e => e[0] === 'event' && e[1] === 'page_view');
  const uniqueUsers = new Set(events.filter(e => e.userId).map(e => e.userId)).size;
  
  return {
    totalVisits: pageViews.length || 0,
    uniqueVisitors: uniqueUsers || 0,
    pageViews: pageViews.length || 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    conversionRate: calculateConversionRate(events)
  };
};

const analyzePages = (events) => {
  const pageViews = events.filter(e => e[0] === 'event' && e[1] === 'page_view');
  const pageStats = {};

  pageViews.forEach(event => {
    const params = event[2] || {};
    const path = params.page_path || '/';
    
    if (!pageStats[path]) {
      pageStats[path] = { views: 0, totalTime: 0, bounces: 0 };
    }
    
    pageStats[path].views++;
  });

  return Object.entries(pageStats)
    .map(([path, stats]) => ({
      path,
      views: stats.views,
      avgTime: Math.round(stats.totalTime / stats.views) || 0,
      bounceRate: Math.round((stats.bounces / stats.views) * 100) || 0
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
};

const analyzeBlogPosts = (events) => {
  const blogViews = events.filter(e => 
    e[0] === 'event' && 
    e[1] === 'view_blog_post'
  );

  const blogStats = {};

  blogViews.forEach(event => {
    const params = event[2] || {};
    const title = params.content_name || 'Unknown';
    
    if (!blogStats[title]) {
      blogStats[title] = { 
        views: 0, 
        totalTime: 0, 
        shares: 0,
        slug: params.content_id || ''
      };
    }
    
    blogStats[title].views++;
    blogStats[title].totalTime += params.reading_time || 0;
  });

  events
    .filter(e => e[0] === 'event' && e[1] === 'share')
    .forEach(event => {
      const params = event[2] || {};
      const title = params.content_name;
      if (blogStats[title]) {
        blogStats[title].shares++;
      }
    });

  return Object.entries(blogStats)
    .map(([title, stats]) => ({
      title,
      slug: stats.slug,
      views: stats.views,
      avgTime: Math.round(stats.totalTime / stats.views) || 0,
      shares: stats.shares
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
};

const analyzeMuseum = (events) => {
  const museumViews = events.filter(e => 
    e[0] === 'event' && 
    e[1] === 'view_museum_item'
  );

  const artworkStats = {};

  museumViews.forEach(event => {
    const params = event[2] || {};
    const title = params.content_name || 'Unknown';
    
    if (!artworkStats[title]) {
      artworkStats[title] = { 
        views: 0,
        slug: params.content_id || '',
        category: params.content_category || ''
      };
    }
    
    artworkStats[title].views++;
  });

  return Object.entries(artworkStats)
    .map(([title, stats]) => ({
      title,
      slug: stats.slug,
      views: stats.views,
      category: stats.category
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
};

const analyzeConversions = (events) => {
  return {
    whatsappClicks: events.filter(e => 
      e[0] === 'event' && 
      (e[1] === 'begin_checkout' || e[1] === 'contact') &&
      e[2]?.method === 'WhatsApp'
    ).length,
    roomViews: events.filter(e => 
      e[0] === 'event' && 
      e[1] === 'view_item'
    ).length,
    dateSelections: events.filter(e => 
      e[0] === 'event' && 
      e[1] === 'select_dates'
    ).length,
    priceChecks: events.filter(e => 
      e[0] === 'event' && 
      e[1] === 'view_price'
    ).length,
    bookingIntents: events.filter(e => 
      e[0] === 'event' && 
      e[1] === 'begin_checkout'
    ).length
  };
};

const analyzeTimeline = (events, range) => {
  const days = parseInt(range.replace('last', '').replace('Days', '')) || 7;
  const timeline = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayEvents = events.filter(e => {
      if (!e.timestamp && !e[3]) return false;
      const eventDate = new Date(e.timestamp || e[3] || Date.now());
      return eventDate.toISOString().split('T')[0] === dateStr;
    });
    
    timeline.push({
      date: dateStr,
      visits: dayEvents.filter(e => e[1] === 'page_view').length,
      bookings: dayEvents.filter(e => e[1] === 'begin_checkout').length
    });
  }
  
  return timeline;
};

const calculateConversionRate = (events) => {
  const views = events.filter(e => e[1] === 'page_view').length;
  const conversions = events.filter(e => e[1] === 'begin_checkout').length;
  return views > 0 ? ((conversions / views) * 100).toFixed(2) : 0;
};

// ==============================================
// 📈 DASHBOARD COMPONENTS (identiques)
// ==============================================

// ... (MetricCard, TimelineChart, TopItemsList, ConversionFunnel - garder identiques)

// ==============================================
// 📊 MAIN DASHBOARD (avec indicateur de source)
// ==============================================

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('last7Days');
  const { data, loading, error, refetch, dataSource } = useGoogleAnalytics(dateRange);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    window.location.reload();
  };

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">Analytics Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D5A4A] to-[#A85C32] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Home className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-white/80 text-sm">
                  La Casa de Teresita
                  {dataSource === 'datalayer' && (
                    <span className="ml-2 text-xs bg-yellow-500/30 px-2 py-1 rounded">
                      ⚠️ Limited Session Data
                    </span>
                  )}
                  {dataSource === 'api' && (
                    <span className="ml-2 text-xs bg-green-500/30 px-2 py-1 rounded">
                      ✓ Full Historical Data
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border-2 border-white/30 font-semibold cursor-pointer hover:bg-white/30 transition-colors"
              >
                <option value="last7Days" className="text-gray-900">Last 7 Days</option>
                <option value="last30Days" className="text-gray-900">Last 30 Days</option>
                <option value="last90Days" className="text-gray-900">Last 90 Days</option>
              </select>
              <button
                onClick={refetch}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-lg hover:bg-white/30 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-lg hover:bg-white/30 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning si dataLayer */}
      {error && dataSource === 'datalayer' && (
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-semibold">
                GA4 API not configured - Using limited session data
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Configure GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_KEY in Netlify for full historical analytics
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* ... reste identique ... */}
      </div>
    </div>
  );
};

// ==============================================
// 🚀 MAIN APP EXPORT
// ==============================================

const DashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isValid = verifyToken();
    setIsAuthenticated(isValid);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard />;
};

export default DashboardPage;