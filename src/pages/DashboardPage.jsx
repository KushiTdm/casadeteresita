import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Users, Eye, Clock, Target, ArrowUp, ArrowDown,
  Home, BookOpen, Building2, MessageCircle, Calendar, Filter, RefreshCw,
  Award, Sparkles, ExternalLink, Info, ChevronDown, ChevronUp, Globe, Smartphone
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ==========================================
// 🎨 THEME & COLORS
// ==========================================

const COLORS = {
  primary: '#2D5A4A',
  secondary: '#A85C32',
  accent: '#C4A96A',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

const CHART_COLORS = [
  COLORS.primary, COLORS.secondary, COLORS.accent,
  COLORS.blue, COLORS.purple, COLORS.pink
];

// ==========================================
// 🔧 UTILITY FUNCTIONS
// ==========================================

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function formatPercentage(value) {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  return `${value.toFixed(1)}%`;
}

// ==========================================
// 📊 KPI CARD
// ==========================================

const KPICard = ({ title, value, trend, icon: Icon, color = 'blue', subtitle, loading = false }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    teal: 'from-teal-500 to-teal-600'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600 bg-green-100';
    if (trend < 0) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend !== undefined && !isNaN(trend) && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${getTrendColor()}`}>
            {trend > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

// ==========================================
// 🔀 USER FLOW DIAGRAM
// ==========================================

const UserFlowDiagram = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const totalVisits = data.totalVisits || 0;
  const roomViews = data.conversions?.roomViews || 0;
  const dateSelections = data.conversions?.dateSelections || 0;
  const priceChecks = data.conversions?.priceChecks || 0;
  const whatsappClicks = data.conversions?.whatsappClicks || 0;

  const funnelData = [
    { name: 'Visits', value: totalVisits, fill: COLORS.blue },
    { name: 'Room Views', value: roomViews, fill: COLORS.purple },
    { name: 'Date Selection', value: dateSelections, fill: COLORS.pink },
    { name: 'Price Check', value: priceChecks, fill: COLORS.orange },
    { name: 'WhatsApp', value: whatsappClicks, fill: COLORS.success }
  ];

  const maxValue = totalVisits || 1;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          User Journey Flow
        </h3>
        <div className="text-sm text-gray-600">
          Conversion: {formatPercentage((whatsappClicks / totalVisits) * 100)}
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {funnelData.map((step, index) => {
          const percentage = (step.value / maxValue) * 100;
          const nextStep = funnelData[index + 1];
          const dropoff = nextStep ? ((step.value - nextStep.value) / step.value) * 100 : 0;

          return (
            <div key={index}>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">{step.name}</span>
                    <span className="text-sm font-bold" style={{ color: step.fill }}>
                      {formatNumber(step.value)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="h-8 rounded-full transition-all duration-500 flex items-center justify-center text-white font-bold text-sm"
                      style={{ width: `${percentage}%`, backgroundColor: step.fill }}
                    >
                      {percentage > 15 && `${percentage.toFixed(0)}%`}
                    </div>
                  </div>
                </div>
              </div>
              
              {nextStep && dropoff > 0 && (
                <div className="flex items-center justify-center py-2">
                  <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                    <ArrowDown className="h-4 w-4" />
                    {dropoff.toFixed(1)}% drop-off
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{formatNumber(totalVisits)}</div>
          <div className="text-xs text-gray-600">Total Visits</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{formatNumber(roomViews)}</div>
          <div className="text-xs text-gray-600">Room Views</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{formatNumber(dateSelections)}</div>
          <div className="text-xs text-gray-600">Date Selections</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{formatNumber(whatsappClicks)}</div>
          <div className="text-xs text-gray-600">WhatsApp Clicks</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🏨 ROOM PERFORMANCE - FIXED
// ==========================================

const RoomPerformance = ({ data, loading }) => {
  const [sortBy, setSortBy] = useState('views');
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const rooms = data?.rooms || [];
  
  // ✅ FIX: Calculs sécurisés avec valeurs par défaut
  const enrichedRooms = rooms.map(room => {
    const views = room.views || 0;
    const avgDuration = room.avgDuration || 0;
    const bounceRate = room.bounceRate || 0;
    
    // ⚠️ Dans GA4 Enhanced, whatsappClicks n'est pas dans room data
    // Il faut l'extraire différemment ou utiliser une estimation
    const whatsappClicks = 0; // À corriger avec vraies données
    
    const conversionRate = views > 0 ? (whatsappClicks / views) * 100 : 0;
    const avgTimeMinutes = Math.round(avgDuration / 60);
    const revenue = whatsappClicks * 60;
    
    return {
      ...room,
      conversionRate: isNaN(conversionRate) ? 0 : conversionRate,
      avgTimeMinutes: isNaN(avgTimeMinutes) ? 0 : avgTimeMinutes,
      revenue: isNaN(revenue) ? 0 : revenue,
      whatsappClicks
    };
  });

  const sortedRooms = [...enrichedRooms].sort((a, b) => {
    switch(sortBy) {
      case 'views': return b.views - a.views;
      case 'conversion': return b.conversionRate - a.conversionRate;
      case 'revenue': return b.revenue - a.revenue;
      default: return 0;
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Home className="h-6 w-6 text-purple-600" />
          Room Performance
        </h3>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="views">Sort by Views</option>
          <option value="conversion">Sort by Conversion</option>
          <option value="revenue">Sort by Revenue Potential</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Room</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Views</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Avg Time</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Bounce</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Engagement</th>
            </tr>
          </thead>
          <tbody>
            {sortedRooms.map((room, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-8 rounded ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium text-gray-900">{room.roomSlug || room.path}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm font-bold text-blue-600">{formatNumber(room.views)}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm text-gray-700">{room.avgTimeMinutes}m</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-sm font-medium ${
                    room.bounceRate > 70 ? 'text-red-600' : 
                    room.bounceRate > 50 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {room.bounceRate.toFixed(0)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(room.conversionRate, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12">
                      {formatPercentage(room.conversionRate)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(enrichedRooms.reduce((sum, r) => sum + r.views, 0))}
          </div>
          <div className="text-xs text-gray-600">Total Room Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {enrichedRooms.length}
          </div>
          <div className="text-xs text-gray-600">Total Rooms Tracked</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {(enrichedRooms.reduce((sum, r) => sum + (r.bounceRate || 0), 0) / enrichedRooms.length).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">Avg Bounce Rate</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 📰 CONTENT PERFORMANCE - IMPLEMENTED
// ==========================================

const ContentPerformance = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || (!data.blog && !data.museum)) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12 text-gray-500">
          No content data available
        </div>
      </div>
    );
  }

  const blogData = data.blog || {};
  const museumData = data.museum || {};

  return (
    <div className="space-y-6">
      {/* Blog Section */}
      {blogData.posts && blogData.posts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Blog Performance
            </h3>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(blogData.overview?.totalViews)}
              </div>
              <div className="text-xs text-gray-600">Total Views</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(blogData.overview?.totalReaders)}
              </div>
              <div className="text-xs text-gray-600">Unique Readers</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {blogData.overview?.avgEngagement || 0}%
              </div>
              <div className="text-xs text-gray-600">Avg Engagement</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {blogData.overview?.totalArticles || 0}
              </div>
              <div className="text-xs text-gray-600">Total Articles</div>
            </div>
          </div>

          {/* Top Posts */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">Top Performing Posts</h4>
            {blogData.topPerformers?.slice(0, 5).map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{post.title}</div>
                    <div className="text-xs text-gray-500">{formatNumber(post.views)} views</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 font-semibold">{post.engagementRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Museum Section */}
      {museumData.artworks && museumData.artworks.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-purple-600" />
              Museum Performance
            </h3>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(museumData.overview?.totalViews)}
              </div>
              <div className="text-xs text-gray-600">Total Views</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(museumData.overview?.totalVisitors)}
              </div>
              <div className="text-xs text-gray-600">Unique Visitors</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">
                {formatNumber(museumData.overview?.mediaInteractions)}
              </div>
              <div className="text-xs text-gray-600">Media Interactions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {museumData.overview?.avgEngagement || 0}%
              </div>
              <div className="text-xs text-gray-600">Avg Engagement</div>
            </div>
          </div>

          {/* Top Artworks */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">Most Viewed Artworks</h4>
            {museumData.topArtworks?.slice(0, 5).map((artwork, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{artwork.title}</div>
                    <div className="text-xs text-gray-500">{formatNumber(artwork.views)} views</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 font-semibold">{artwork.engagementRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 📈 MAIN DASHBOARD
// ==========================================

const CompleteDashboard = () => {
  const [data, setData] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [dateRange, setDateRange] = useState('last7Days');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
    if (activeTab === 'content') {
      fetchContentData();
    }
  }, [dateRange, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchGA4AnalyticsEnhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange, useCache: false })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📊 Analytics data received:', result);
        setData(result);
      } else {
        console.error('Failed to fetch analytics:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentData = async () => {
    setContentLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchContentPerformance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange, useCache: false })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📰 Content data received:', result);
        setContentData(result);
      } else {
        console.error('Failed to fetch content data:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setContentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Complete Analytics</h1>
            <p className="text-gray-600 mt-2">La Casa de Teresita - Professional Dashboard</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="last90Days">Last 90 Days</option>
            </select>
            
            <button
              onClick={() => {
                fetchData();
                if (activeTab === 'content') fetchContentData();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Visits"
            value={formatNumber(data?.overview?.totalVisits)}
            trend={data?.overview?.trends?.totalVisits}
            icon={Users}
            color="blue"
            loading={loading}
          />
          <KPICard
            title="Room Views"
            value={formatNumber(data?.conversions?.roomViews)}
            icon={Home}
            color="purple"
            loading={loading}
          />
          <KPICard
            title="WhatsApp Clicks"
            value={formatNumber(data?.conversions?.whatsappClicks)}
            icon={MessageCircle}
            color="green"
            subtitle="From all sources"
            loading={loading}
          />
          <KPICard
            title="Conversion Rate"
            value={formatPercentage(data?.overview?.conversionRate)}
            icon={Target}
            color="orange"
            subtitle="To WhatsApp"
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {['overview', 'rooms', 'content'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <UserFlowDiagram data={data?.overview} loading={loading} />
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <RoomPerformance data={data} loading={loading} />
          </div>
        )}

        {activeTab === 'content' && (
          <ContentPerformance data={contentData} loading={contentLoading} />
        )}
      </div>
    </div>
  );
};

export default CompleteDashboard;