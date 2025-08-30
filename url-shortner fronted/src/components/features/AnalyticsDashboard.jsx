import React from 'react';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import DeviceChart from '../charts/DeviceChart';

/**
 * Analytics dashboard component for overview charts
 * Simplified version for dashboard page
 */
const AnalyticsDashboard = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {(data.totalClicks || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total Clicks</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {(data.clicksThisWeek || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">This Week</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {(data.clicksToday || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Today</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.dailyClicks && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <TimeSeriesChart data={data.dailyClicks.slice(-7)} height={200} />
          </div>
        )}
        
        {data.deviceStats && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Device Breakdown</h3>
            <DeviceChart data={data.deviceStats} height={200} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;