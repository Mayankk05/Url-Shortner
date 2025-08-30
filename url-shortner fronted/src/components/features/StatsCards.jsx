import React from 'react';
import { TrendingUp, Link as LinkIcon, MousePointer, Award } from 'lucide-react';
import { formatters } from '../../utils/formatters';

/**
 * Statistics cards component for dashboard overview
 * Displays key metrics from backend user stats endpoint
 */
const StatsCards = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total URLs',
      value: stats.totalUrls || 0,
      icon: LinkIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: null // Could add growth calculation here
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks || 0,
      icon: MousePointer,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: null
    },
    {
      title: 'Avg. Clicks per URL',
      value: stats.totalUrls > 0 ? Math.round((stats.totalClicks || 0) / stats.totalUrls) : 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: null
    },
    {
      title: 'Subscription',
      value: formatters.subscriptionTier(stats.subscriptionTier),
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: null,
      isText: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.isText ? card.value : formatters.number(card.value)}
                  </p>
                  {card.change && (
                    <p className={`ml-2 text-sm ${
                      card.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change > 0 ? '+' : ''}{card.change}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;