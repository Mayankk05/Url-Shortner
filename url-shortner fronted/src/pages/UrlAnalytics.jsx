import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share, Copy } from 'lucide-react';
import { AnalyticsService } from '../services/analyticsService';
import { useToastContext } from '../context/ToastContext';
import { copyToClipboard } from '../utils/helpers';
import { formatters } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import GeographicChart from '../components/charts/GeographicChart';
import DeviceChart from '../components/charts/DeviceChart';
import BrowserChart from '../components/charts/BrowserChart';

/**
 * Individual URL analytics page with comprehensive metrics
 * Integrates with Spring Boot analytics service
 */
const UrlAnalytics = () => {
  const { shortCode } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToastContext();

  useEffect(() => {
    loadAnalytics();
  }, [shortCode, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const result = await AnalyticsService.getUrlAnalytics(shortCode, timeRange);
      setAnalytics(result);
    } catch (err) {
      error('Failed to load analytics data');
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (analytics?.shortUrl) {
      const copied = await copyToClipboard(analytics.shortUrl);
      if (copied) {
        success('URL copied to clipboard');
      } else {
        error('Failed to copy URL');
      }
    }
  };

  const handleExport = async () => {
    try {
      await AnalyticsService.exportAnalytics(shortCode, 'csv', timeRange);
      success('Analytics exported successfully');
    } catch (err) {
      error('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Analytics data not found</p>
        <Link to="/urls">
          <Button variant="primary" className="mt-4">
            Back to URLs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/urls">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">URL Analytics</h1>
            <p className="text-sm text-gray-500">{analytics.shortCode}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={handleCopyUrl}>
            <Copy className="h-4 w-4 mr-2" />
            Copy URL
          </Button>
          <Button variant="ghost" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* URL Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">URL Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Original URL</p>
                <p className="text-sm text-gray-900 break-all">{analytics.originalUrl}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Short URL</p>
                <p className="text-sm text-primary-600 break-all">{analytics.shortUrl}</p>
              </div>
              {analytics.title && (
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="text-sm text-gray-900">{analytics.title}</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {formatters.number(analytics.totalClicks)}
                </p>
                <p className="text-sm text-gray-500">Total Clicks</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {formatters.number(analytics.clicksToday)}
                </p>
                <p className="text-sm text-gray-500">Clicks Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Analytics Period</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Clicks Over Time</h3>
            <TimeSeriesChart data={analytics.dailyClicks} />
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Geographic Distribution</h3>
          <GeographicChart data={analytics.topCountries} />
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Device Types</h3>
          <DeviceChart data={analytics.deviceStats} />
        </div>

        {/* Browser Statistics */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Browser Distribution</h3>
            <BrowserChart data={analytics.browserStats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlAnalytics;
