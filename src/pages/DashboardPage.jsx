import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Users, Eye, Clock, Target, ArrowUp, ArrowDown,
  Home, BookOpen, Building2, MessageCircle, Calendar, Filter, RefreshCw,
  Award, Sparkles, ExternalLink, Info, ChevronDown, ChevronUp, Globe, Smartphone
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Sankey, Rectangle
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
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function formatPercentage(value) {
  return `${(value || 0).toFixed(1)}%`;
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
        {trend !== undefined && (
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
// 🔀 USER FLOW SANKEY DIAGRAM
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

  // Utiliser les vraies données
  const totalVisits = data.totalVisits || 0;
  const roomViews = data.conversions?.roomViews || 0;
  const dateSelections = data.conversions?.dateSelections || 0;
  const priceChecks = data.conversions?.priceChecks || 0;
  const whatsappClicks = data.conversions?.whatsappClicks || 0;

  // Préparer les données pour le Sankey (simplifié car Recharts Sankey est limité)
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

      {/* Visual Flow Chart */}
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
              
              {nextStep && (
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
// 🏨 ROOM PERFORMANCE
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
  
  // Calculer les métriques supplémentaires
  const enrichedRooms = rooms.map(room => {
    const conversionRate = room.views > 0 ? (room.whatsappClicks / room.views) * 100 : 0;
    const avgTimeMinutes = Math.round(room.avgDuration / 60);
    
    return {
      ...room,
      conversionRate,
      avgTimeMinutes,
      revenue: room.whatsappClicks * 60 // Estimation du revenu potentiel
    };
  });

  // Trier
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
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">WhatsApp</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Conv. Rate</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Revenue Est.</th>
            </tr>
          </thead>
          <tbody>
            {sortedRooms.map((room, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-8 rounded ${index === 0 ? 'bg-gold-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium text-gray-900">{room.roomSlug}</span>
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
                  <span className="text-sm font-bold text-green-600">{room.whatsappClicks || 0}</span>
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
                      {room.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm font-bold text-purple-600">${room.revenue}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(enrichedRooms.reduce((sum, r) => sum + r.views, 0))}
          </div>
          <div className="text-xs text-gray-600">Total Room Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatNumber(enrichedRooms.reduce((sum, r) => sum + (r.whatsappClicks || 0), 0))}
          </div>
          <div className="text-xs text-gray-600">Total WhatsApp Clicks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {(enrichedRooms.reduce((sum, r) => sum + r.conversionRate, 0) / enrichedRooms.length).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">Avg Conversion Rate</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 💬 WHATSAPP CONVERSION FUNNEL
// ==========================================

const WhatsAppConversionFunnel = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  const funnelData = [
    { 
      step: 'Page Views',
      value: data?.pageViews || 0,
      color: 'bg-blue-500',
      icon: Eye
    },
    { 
      step: 'Room Views',
      value: data?.conversions?.roomViews || 0,
      color: 'bg-purple-500',
      icon: Home
    },
    { 
      step: 'Date Selected',
      value: data?.conversions?.dateSelections || 0,
      color: 'bg-pink-500',
      icon: Calendar
    },
    { 
      step: 'Price Checked',
      value: data?.conversions?.priceChecks || 0,
      color: 'bg-orange-500',
      icon: Target
    },
    { 
      step: 'WhatsApp Clicked',
      value: data?.conversions?.whatsappClicks || 0,
      color: 'bg-green-500',
      icon: MessageCircle
    }
  ];

  const maxValue = funnelData[0].value;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-green-600" />
          WhatsApp Conversion Funnel
        </h3>
        <div className="text-sm font-semibold text-green-600">
          Overall: {formatPercentage((data?.conversions?.whatsappClicks / data?.pageViews) * 100)}
        </div>
      </div>

      <div className="space-y-4">
        {funnelData.map((step, index) => {
          const percentage = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
          const dropoff = index > 0 
            ? ((funnelData[index - 1].value - step.value) / funnelData[index - 1].value) * 100 
            : 0;
          const StepIcon = step.icon;

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`${step.color} p-2 rounded-lg`}>
                    <StepIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{step.step}</span>
                </div>
                <div className="flex items-center gap-4">
                  {index > 0 && dropoff > 0 && (
                    <span className="text-xs text-red-600 font-medium">
                      -{dropoff.toFixed(1)}% drop
                    </span>
                  )}
                  <span className="text-sm font-bold text-gray-900 w-20 text-right">
                    {formatNumber(step.value)}
                  </span>
                  <span className="text-xs text-gray-500 w-16 text-right">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`${step.color} h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 15 && (
                    <span className="text-xs font-bold text-white">
                      {formatNumber(step.value)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Conversion Insights</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Page → Room:</span>
            <span className="ml-2 font-bold text-purple-600">
              {formatPercentage((data?.conversions?.roomViews / data?.pageViews) * 100)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Room → Date:</span>
            <span className="ml-2 font-bold text-pink-600">
              {formatPercentage((data?.conversions?.dateSelections / data?.conversions?.roomViews) * 100)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Date → Price:</span>
            <span className="ml-2 font-bold text-orange-600">
              {formatPercentage((data?.conversions?.priceChecks / data?.conversions?.dateSelections) * 100)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Price → WhatsApp:</span>
            <span className="ml-2 font-bold text-green-600">
              {formatPercentage((data?.conversions?.whatsappClicks / data?.conversions?.priceChecks) * 100)}
            </span>
          </div>
        </div>
      </div>
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
              onClick={fetchData}
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
            <WhatsAppConversionFunnel data={data?.overview} loading={loading} />
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <RoomPerformance data={data} loading={loading} />
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Content Performance</h3>
            <p className="text-gray-600">Coming soon: Blog & Museum analytics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompleteDashboard;