// src/pages/DashboardPage.jsx - VERSION AVEC NETLIFY IDENTITY

import { useState, useEffect } from 'react';
import { 
  Home, LogOut, TrendingUp, Users, Eye, Clock, 
  Calendar, DollarSign, Globe, Smartphone, MapPin,
  BookOpen, Building2, MessageCircle, Star, ChevronDown,
  ChevronUp, Filter, Download, RefreshCw, AlertCircle
} from 'lucide-react';

// ==============================================
// 🔐 NETLIFY IDENTITY INTEGRATION
// ==============================================

/**
 * Hook pour gérer l'authentification Netlify Identity
 */
function useNetlifyIdentity() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attendre que le widget Netlify Identity soit chargé
    const checkIdentity = () => {
      if (window.netlifyIdentity) {
        // Récupérer l'utilisateur actuel
        const currentUser = window.netlifyIdentity.currentUser();
        setUser(currentUser);
        setLoading(false);

        // Écouter les changements d'authentification
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
        // Réessayer après un court délai
        setTimeout(checkIdentity, 100);
      }
    };

    checkIdentity();

    return () => {
      // Cleanup listeners
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
// 🔒 LOGIN PAGE WITH NETLIFY IDENTITY
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
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-[#C4A96A]/10 rounded-full mb-4">
            <Home className="h-12 w-12 text-[#C4A96A]" />
          </div>
          <h1 className="text-3xl font-bold text-[#2D5A4A] mb-2">
            Dashboard Login
          </h1>
          <p className="text-gray-600">
            La Casa de Teresita - Admin Access
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#2D5A4A] text-white py-4 rounded-lg font-semibold hover:bg-[#1F3D32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">ℹ️ Access Information:</p>
            <ul className="space-y-1 text-xs">
              <li>• Click the button above to open the login modal</li>
              <li>• Use your Netlify Identity credentials</li>
              <li>• First-time users: You'll receive an invite email</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          Protected by Netlify Identity
        </div>
      </div>
    </div>
  );
};

// ==============================================
// 📊 GOOGLE ANALYTICS 4 API INTEGRATION
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
// 📈 DASHBOARD COMPONENTS
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
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded text-xs font-semibold ${
            trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-sm text-gray-600 font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

// ==============================================
// 📊 MAIN DASHBOARD
// ==============================================

const Dashboard = () => {
  const { user, logout } = useNetlifyIdentity();
  const [dateRange, setDateRange] = useState('last7Days');
  const { data, loading, error, refetch, dataSource } = useGoogleAnalytics(dateRange);

  const handleLogout = () => {
    logout();
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
                  Welcome, {user?.user_metadata?.full_name || user?.email}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-white rounded-full mb-6 shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#C4A96A] border-t-transparent"></div>
            </div>
            <p className="text-xl text-gray-600">Loading analytics...</p>
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-[#A85C32]" />
                Top Pages
              </h2>
              <div className="space-y-3">
                {data.pages?.slice(0, 10).map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{page.path}</div>
                      <div className="text-sm text-gray-500">
                        {page.avgTime}s avg time • {page.bounceRate}% bounce
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#A85C32]">{page.views}</div>
                      <div className="text-xs text-gray-500">views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog Performance */}
            {data.blog && data.blog.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-[#A85C32]" />
                  Blog Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.blog.slice(0, 6).map((post, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2 line-clamp-1">
                        {post.title}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{post.views} views</span>
                        <span className="text-gray-600">{post.avgTime}s avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Museum Performance */}
            {data.museum && data.museum.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-[#A85C32]" />
                  Museum Collection Views
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.museum.slice(0, 6).map((artwork, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2 line-clamp-1">
                        {artwork.title}
                      </div>
                      <div className="flex items-center justify-between text-sm">
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
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No data available</p>
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
      <div className="min-h-screen bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#C4A96A] border-t-transparent"></div>
          </div>
          <p className="text-xl text-white">Loading...</p>
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