import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Users, Globe } from 'lucide-react';
import { UrlService } from '../services/urlService';
import { AnalyticsService } from '../services/analyticsService';
import { useToastContext } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import StatsCards from '../components/features/StatsCards';
import AnalyticsDashboard from '../components/features/AnalyticsDashboard';
import UrlShortener from '../components/features/UrlShortener';

/**
 * Main dashboard page showing analytics overview and quick actions
 * Integrates with Spring Boot analytics and URL services
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [topUrls, setTopUrls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToastContext();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load data in parallel
      const [statsResult, topUrlsResult, analyticsResult] = await Promise.allSettled([
        UrlService.getUserStats(),
        UrlService.getTopUrls(5),
        AnalyticsService.getDashboardAnalytics()
      ]);

      // Handle stats
      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      }

      // Handle top URLs
      if (topUrlsResult.status === 'fulfilled') {
        setTopUrls(topUrlsResult.value);
      }

      // Handle analytics
      if (analyticsResult.status === 'fulfilled') {
        setAnalytics(analyticsResult.value);
      }

    } catch (err) {
      error('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCreated = () => {
    // Refresh dashboard data when new URL is created
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Overview of your URL shortening activity and performance metrics
          </p>
        </div>
        <Link to="/urls/create">
          <Button variant="primary" size="md" className="shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="h-5 w-5 mr-2" />
            Create URL
          </Button>
        </Link>
      </div>

      {/* Quick URL Shortener */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Quick URL Shortener</h2>
        </div>
        <UrlShortener onSuccess={handleUrlCreated} />
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics Overview</h2>
          <AnalyticsDashboard data={analytics} />
        </div>
      )}

      {/* Top URLs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Top Performing URLs</h2>
            <Link to="/urls" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {topUrls.length > 0 ? (
            <div className="space-y-4">
              {topUrls.map((url) => (
                <div key={url.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {url.title || 'Untitled'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {url.originalUrl}
                        </p>
                        <p className="text-xs text-gray-400">
                          {url.shortUrl}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {url.clickCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No URLs created yet</p>
              <Link to="/urls/create">
                <Button variant="primary" size="sm" className="mt-2">
                  Create your first URL
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {/* This would show recent URL creations, clicks, etc. */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Your URLs received <span className="font-medium">{stats?.totalClicks || 0}</span> clicks today
              </p>
              <p className="text-xs text-gray-500">Updated just now</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                You have <span className="font-medium">{stats?.totalUrls || 0}</span> active URLs
              </p>
              <p className="text-xs text-gray-500">Total created</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;