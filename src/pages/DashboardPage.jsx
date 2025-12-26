// src/pages/DashboardPage.jsx - VERSION RESPONSIVE

import { useState, useEffect } from 'react';
import { 
  Home, LogOut, TrendingUp, Users, Eye, Clock, 
  Calendar, DollarSign, Globe, Smartphone, MapPin,
  BookOpen, Building2, MessageCircle, Star, ChevronDown,
  ChevronUp, Filter, Download, RefreshCw, AlertCircle,
  Menu, X as XIcon
} from 'lucide-react';

// ==============================================
// 🔐 NETLIFY IDENTITY INTEGRATION
// ==============================================

function useNetlifyIdentity() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIdentity = () => {
      if (window.netlifyIdentity) {
        const currentUser = window.netlifyIdentity.currentUser();
        setUser(currentUser);
        setLoading(false);

        window.netlifyIdentity.on('login', (user) => {
          console.log('✅ User logged in:', user.email);
          setUser(user);
          setLoading(false);
        });

        window.netlifyIdentity.on('logout', () => {
          console.log('👋 User logged out');
          setUser(null);
        });

        window.netlifyIdentity.on('error', (err) => {
          console.error('❌ Netlify Identity error:', err);
        });
      } else {
        setTimeout(checkIdentity, 100);
      }
    };

    checkIdentity();

    return () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.off('login');
        window.netlifyIdentity.off('logout');
        window.netlifyIdentity.off('error');
      }
    };
  }, []);

  const login = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open('login');
    }
  };

  const logout = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.logout();
    }
  };

  return { user, loading, login, logout };
}

// ==============================================
// 🔒 LOGIN PAGE RESPONSIVE
// ==============================================

const LoginPage = ({ onLogin }) => {
  const { login } = useNetlifyIdentity();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block p-3 sm:p-4 bg-[#C4A96A]/10 rounded-full mb-4">
            <Home className="h-10 w-10 sm:h-12 sm:w-12 text-[#C4A96A]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D5A4A] mb-2">
            Dashboard Login
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            La Casa de Teresita - Admin Access
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#2D5A4A] text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-[#1F3D32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Loading...</span>
              </>
            ) : (
              <span>Login with Netlify Identity</span>
            )}
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-blue-800">
            <p className="font-semibold mb-2">ℹ️ Access Information:</p>
            <ul className="space-y-1 text-xs">
              <li>• Click the button above to open the login modal</li>
              <li>• Use your Netlify Identity credentials</li>
              <li>• First-time users: You'll receive an invite email</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t text-center text-xs sm:text-sm text-gray-500">
          Protected by Netlify Identity
        </div>
      </div>
    </div>
  );
};

// ==============================================
// 📊 GOOGLE ANALYTICS 4 API
// ==============================================

const useGoogleAnalytics = (dateRange = 'last7Days') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('api');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
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
      } else {
        throw new Error('GA4 API unavailable');
      }
    } catch (apiError) {
      console.error('GA4 API Error:', apiError);
      setError('Unable to load analytics. Please check configuration.');
      setDataSource('unavailable');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchAnalyticsData, dataSource };
};

// ==============================================
// 📈 METRIC CARD RESPONSIVE
// ==============================================

const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded text-xs font-semibold ${
            trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-xs sm:text-sm text-gray-600 font-medium mb-1">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

// ==============================================
// 📊 MAIN DASHBOARD RESPONSIVE
// ==============================================

const Dashboard = () => {
  const { user, logout } = useNetlifyIdentity();
  const [dateRange, setDateRange] = useState('last7Days');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { data, loading, error, refetch, dataSource } = useGoogleAnalytics(dateRange);

  const handleLogout = () => {
    logout();
  };

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 sm:p-8 text-center">
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-red-900 mb-2">Analytics Error</h2>
            <p className="text-sm sm:text-base text-red-700 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base"
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
      {/* Header - Responsive */}
      <div className="bg-gradient-to-r from-[#2D5A4A] to-[#A85C32] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg backdrop-blur-sm">
                <Home className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-white/80 text-xs sm:text-sm">
                  Welcome, {user?.user_metadata?.full_name || user?.email}
                  {dataSource === 'api' && (
                    <span className="ml-2 text-xs bg-green-500/30 px-2 py-1 rounded">
                      ✓ Live Data
                    </span>
                  )}
                </p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-lg font-bold">Dashboard</h1>
              </div>
            </div>

            {/* Actions - Desktop */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg border-2 border-white/30 font-semibold cursor-pointer hover:bg-white/30 transition-colors text-sm"
              >
                <option value="last7Days" className="text-gray-900">Last 7 Days</option>
                <option value="last30Days" className="text-gray-900">Last 30 Days</option>
                <option value="last90Days" className="text-gray-900">Last 90 Days</option>
              </select>
              <button
                onClick={refetch}
                className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg hover:bg-white/30 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg hover:bg-white/30 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden bg-white/20 backdrop-blur-sm p-2 rounded-lg"
            >
              {showMobileMenu ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/20 space-y-3">
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setShowMobileMenu(false);
                }}
                className="w-full bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg border-2 border-white/30 font-semibold text-sm"
              >
                <option value="last7Days" className="text-gray-900">Last 7 Days</option>
                <option value="last30Days" className="text-gray-900">Last 30 Days</option>
                <option value="last90Days" className="text-gray-900">Last 90 Days</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    refetch();
                    setShowMobileMenu(false);
                  }}
                  className="flex-1 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="flex-1 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {loading ? (
          <div className="text-center py-12 sm:py-20">
            <div className="inline-block p-4 sm:p-6 bg-white rounded-full mb-4 sm:mb-6 shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-[#C4A96A] border-t-transparent"></div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600">Loading analytics...</p>
          </div>
        ) : data ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Overview Metrics - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <MetricCard
                icon={Users}
                title="Total Visits"
                value={data.overview?.totalVisits?.toLocaleString() || '0'}
                subtitle="Sessions"
                color="blue"
              />
              <MetricCard
                icon={Eye}
                title="Unique Visitors"
                value={data.overview?.uniqueVisitors?.toLocaleString() || '0'}
                subtitle="Users"
                color="green"
              />
              <MetricCard
                icon={TrendingUp}
                title="Page Views"
                value={data.overview?.pageViews?.toLocaleString() || '0'}
                subtitle="Total views"
                color="purple"
              />
              <MetricCard
                icon={MessageCircle}
                title="WhatsApp Clicks"
                value={data.conversions?.whatsappClicks?.toLocaleString() || '0'}
                subtitle={`${data.overview?.conversionRate || 0}% conversion`}
                color="orange"
              />
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#A85C32]" />
                <span className="text-sm sm:text-xl">Top Pages</span>
              </h2>
              <div className="space-y-2 sm:space-y-3 overflow-x-auto">
                {data.pages?.slice(0, 10).map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-xs sm:text-base truncate">{page.path}</div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {page.avgTime}s avg • {page.bounceRate}% bounce
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <div className="font-bold text-[#A85C32] text-sm sm:text-base">{page.views}</div>
                      <div className="text-xs text-gray-500">views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog Performance - Responsive Grid */}
            {data.blog && data.blog.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#A85C32]" />
                  <span className="text-sm sm:text-xl">Blog Performance</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {data.blog.slice(0, 6).map((post, index) => (
                    <div key={index} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2 line-clamp-1 text-xs sm:text-base">
                        {post.title}
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">{post.views} views</span>
                        <span className="text-gray-600">{post.avgTime}s avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Museum Performance - Responsive Grid */}
            {data.museum && data.museum.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#A85C32]" />
                  <span className="text-sm sm:text-xl">Museum Collection Views</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {data.museum.slice(0, 6).map((artwork, index) => (
                    <div key={index} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2 line-clamp-1 text-xs sm:text-base">
                        {artwork.title}
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">{artwork.views} views</span>
                        <span className="px-2 py-1 bg-[#C4A96A]/20 text-[#A85C32] rounded text-xs font-semibold">
                          {artwork.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg sm:text-xl text-gray-600">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==============================================
// 🚀 MAIN APP EXPORT
// ==============================================

const DashboardPage = () => {
  const { user, loading } = useNetlifyIdentity();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-[#C4A96A] border-t-transparent"></div>
          </div>
          <p className="text-lg sm:text-xl text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard />;
};

export default DashboardPage;