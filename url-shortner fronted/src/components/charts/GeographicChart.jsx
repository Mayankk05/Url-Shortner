import React from 'react';
import { formatters } from '../../utils/formatters';

/**
 * Geographic distribution chart showing top countries
 * Simple bar chart implementation for country data
 */
const GeographicChart = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg">
        <p className="text-gray-500">No geographic data available</p>
      </div>
    );
  }

  const maxClicks = Math.max(...data.map(item => item.clicks));

  return (
    <div style={{ height: `${height}px` }} className="space-y-3">
      {data.slice(0, 10).map((country, index) => (
        <div key={country.country} className="flex items-center space-x-3">
          <div className="w-16 text-sm text-gray-600 truncate">
            {country.country}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
            <div
              className="bg-primary-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(country.clicks / maxClicks) * 100}%` }}
            />
          </div>
          <div className="w-12 text-sm text-gray-900 text-right">
            {formatters.number(country.clicks)}
          </div>
          <div className="w-12 text-xs text-gray-500 text-right">
            {formatters.percentage(country.clicks, data.reduce((sum, c) => sum + c.clicks, 0))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeographicChart;