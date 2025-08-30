import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Globe, Users } from 'lucide-react';
import { AnalyticsService } from '../services/analyticsService';
import { UrlService } from '../services/urlService';
import { useToastContext } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import AnalyticsDashboard from '../components/features/AnalyticsDashboard';
import StatsCards from '../components/features/StatsCards';

/**
 * General Analytics page showing user's overall analytics
 * Integrates with Spring Boot analytics dashboard endpoint
 */
const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToastContext();

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load analytics and stats in parallel
      const [analyticsResult, statsResult] = await Promise.allSettled([
        AnalyticsService.getDashboardAnalytics(),
        UrlService.getUserStats()
      ]);

      // Handle analytics
      if (analyticsResult.status === 'fulfilled') {
        setAnalytics(analyticsResult.value);
      }

      // Handle stats
      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      }

    } catch (err) {
      error('Failed to load analytics data');
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive analytics and insights for all your URLs
          </p>
        </div>
        <Link to="/urls">
          <Button variant="primary">
            <BarChart3 className="h-4 w-4 mr-2" />
            View URLs
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Analytics Dashboard */}
      {analytics ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics Overview</h2>
          <AnalyticsDashboard data={analytics} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No analytics data available yet</p>
            <p className="text-sm text-gray-400 mb-6">
              Create some URLs and get clicks to see analytics here
            </p>
            <Link to="/urls/create">
              <Button variant="primary">
                Create Your First URL
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-blue-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">URL Management</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            View and manage all your shortened URLs in one place
          </p>
          <Link to="/urls">
            <Button variant="outline" size="sm">
              Manage URLs
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Performance Insights</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Get detailed analytics for individual URLs
          </p>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats?.totalUrls || 0}
            </div>
            <div className="text-sm text-gray-500">Total URLs Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats?.totalClicks || 0}
            </div>
            <div className="text-sm text-gray-500">Total Clicks Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats?.totalUrls > 0 ? Math.round((stats?.totalClicks || 0) / stats?.totalUrls) : 0}
            </div>
            <div className="text-sm text-gray-500">Average Clicks per URL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;