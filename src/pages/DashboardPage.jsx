import React, { useState, useEffect } from 'react';
import ContentPerformance from '../components/ContentPerformance';
import {
  TrendingUp, TrendingDown, Users, Eye, Clock, Target,
  ArrowUp, ArrowDown, Minus, BarChart3, PieChart, 
  Smartphone, Globe, MapPin, RefreshCw, Calendar,
  ExternalLink, BookOpen, Building2, Home
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

// ==============================================
// 🎨 THEME & COLORS
// ==============================================

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
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.blue,
  COLORS.purple,
  COLORS.pink
];

// ==============================================
// 🔧 UTILITY FUNCTIONS
// ==============================================

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toLocaleString() || '0';
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatPercentage(value) {
  return `${value?.toFixed(1) || 0}%`;
}

// ==============================================
// 📊 KPI CARD WITH TREND
// ==============================================

const KPICard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  color = 'blue',
  subtitle,
  loading = false 
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    teal: 'from-teal-500 to-teal-600'
  };

  const getTrendIcon = () => {
    if (trend > 0) return <ArrowUp className="h-4 w-4" />;
    if (trend < 0) return <ArrowDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600 bg-green-100';
    if (trend < 0) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend !== undefined && trend !== null && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-1">
        {title}
      </h3>
      
      <p className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </p>
      
      {subtitle && (
        <p className="text-xs text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// ==============================================
// 📈 TIMELINE CHART
// ==============================================

const TimelineChart = ({ data, loading = false }) => {
  const [activeMetric, setActiveMetric] = useState('sessions');

  const metrics = [
    { key: 'sessions', label: 'Sessions', color: COLORS.primary },
    { key: 'users', label: 'Users', color: COLORS.secondary },
    { key: 'pageViews', label: 'Page Views', color: COLORS.accent }
  ];

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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          Traffic Timeline
        </h3>
        
        <div className="flex gap-2">
          {metrics.map(metric => (
            <button
              key={metric.key}
              onClick={() => setActiveMetric(metric.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeMetric === metric.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={metrics.find(m => m.key === activeMetric)?.color} 
                stopOpacity={0.3}
              />
              <stop 
                offset="95%" 
                stopColor={metrics.find(m => m.key === activeMetric)?.color} 
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey={activeMetric}
            stroke={metrics.find(m => m.key === activeMetric)?.color}
            strokeWidth={2}
            fill="url(#colorMetric)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==============================================
// 🥧 DEVICE BREAKDOWN PIE CHART
// ==============================================

const DeviceBreakdown = ({ data, loading = false }) => {
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

  const chartData = data?.map((device, index) => ({
    name: device.device,
    value: device.sessions,
    color: CHART_COLORS[index % CHART_COLORS.length]
  })) || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Smartphone className="h-6 w-6 text-purple-600" />
        Device Breakdown
      </h3>

      <div className="flex items-center justify-between">
        <ResponsiveContainer width="50%" height={200}>
          <RechartsPie>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPie>
        </ResponsiveContainer>

        <div className="flex-1 space-y-3">
          {chartData.map((device, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: device.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {device.name}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {formatNumber(device.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==============================================
// 📄 TOP PAGES TABLE
// ==============================================

const TopPagesTable = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Eye className="h-6 w-6 text-green-600" />
        Top Pages
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Page
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Views
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Avg Time
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Bounce Rate
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Engagement
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.slice(0, 10).map((page, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {page.path}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm font-bold text-blue-600">
                    {formatNumber(page.views)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm text-gray-700">
                    {formatDuration(page.avgDuration)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-sm font-medium ${
                    page.bounceRate > 70 ? 'text-red-600' : 
                    page.bounceRate > 50 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {formatPercentage(page.bounceRate)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm font-medium text-purple-600">
                    {formatPercentage(page.engagementRate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==============================================
// 🎯 CONVERSION FUNNEL
// ==============================================

const ConversionFunnel = ({ conversions, totalVisits, loading = false }) => {
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

  const funnelSteps = [
    { 
      label: 'Website Visits', 
      value: totalVisits, 
      color: 'bg-blue-500',
      icon: Globe
    },
    { 
      label: 'Room Views', 
      value: conversions?.roomViews || 0,
      color: 'bg-purple-500',
      icon: Home
    },
    { 
      label: 'Date Selected', 
      value: conversions?.dateSelections || 0,
      color: 'bg-pink-500',
      icon: Calendar
    },
    { 
      label: 'Price Checked', 
      value: conversions?.priceChecks || 0,
      color: 'bg-orange-500',
      icon: Target
    },
    { 
      label: 'WhatsApp Click', 
      value: conversions?.whatsappClicks || 0,
      color: 'bg-green-500',
      icon: ExternalLink
    }
  ];

  const maxValue = funnelSteps[0].value;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Target className="h-6 w-6 text-orange-600" />
        Conversion Funnel
      </h3>

      <div className="space-y-4">
        {funnelSteps.map((step, index) => {
          const percentage = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
          const dropoff = index > 0 
            ? ((funnelSteps[index - 1].value - step.value) / funnelSteps[index - 1].value) * 100 
            : 0;
          const StepIcon = step.icon;

          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StepIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {step.label}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {index > 0 && dropoff > 0 && (
                    <span className="text-xs text-red-600 font-medium">
                      -{dropoff.toFixed(1)}% dropoff
                    </span>
                  )}
                  <span className="text-sm font-bold text-gray-900">
                    {formatNumber(step.value)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${step.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-blue-700">
            Overall Conversion Rate:
          </span>{' '}
          {totalVisits > 0 
            ? ((conversions?.whatsappClicks / totalVisits) * 100).toFixed(2)
            : 0}%
        </p>
      </div>
    </div>
  );
};

// ==============================================
// 🏨 MAIN DASHBOARD COMPONENT
// ==============================================

const AdvancedDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last7Days');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchGA4AnalyticsEnhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange })
      });

      if (response.ok) {
        const analytics = await response.json();
        setData(analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              La Casa de Teresita - Professional Analytics
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="last90Days">Last 90 Days</option>
            </select>
            
            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Visits"
            value={formatNumber(data?.overview?.totalVisits)}
            trend={data?.overview?.trends?.totalVisits}
            icon={Users}
            color="blue"
            subtitle="Sessions"
            loading={loading}
          />
          <KPICard
            title="Unique Visitors"
            value={formatNumber(data?.overview?.uniqueVisitors)}
            trend={data?.overview?.trends?.uniqueVisitors}
            icon={Eye}
            color="purple"
            subtitle="Users"
            loading={loading}
          />
          <KPICard
            title="Avg Session Duration"
            value={formatDuration(data?.overview?.avgSessionDuration)}
            icon={Clock}
            color="orange"
            subtitle="Time on site"
            loading={loading}
          />
          <KPICard
            title="Conversion Rate"
            value={formatPercentage(data?.overview?.conversionRate)}
            icon={Target}
            color="green"
            subtitle="To WhatsApp"
            loading={loading}
          />
        </div>

        {/* Timeline Chart */}
        <TimelineChart data={data?.timeline} loading={loading} />

        {/* Device & Conversion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeviceBreakdown data={data?.devices} loading={loading} />
          <ConversionFunnel 
            conversions={data?.conversions}
            totalVisits={data?.overview?.totalVisits}
            loading={loading}
          />
        </div>

        {/* Top Pages */}
        <TopPagesTable data={data?.topPages} loading={loading} />
      </div>
    </div>
  );
};

export default AdvancedDashboard;