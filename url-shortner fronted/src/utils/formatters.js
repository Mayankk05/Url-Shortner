import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Data formatting utilities for display
 */
export const formatters = {
  /**
   * Format date for display
   */
  date: (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  },

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  relativeTime: (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  },

  /**
   * Format number with commas
   */
  number: (num) => {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString();
  },

  /**
   * Format percentage
   */
  percentage: (value, total) => {
    if (!total || total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
  },

  /**
   * Truncate text with ellipsis
   */
  truncate: (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * Format subscription tier for display
   */
  subscriptionTier: (tier) => {
    const tiers = {
      FREE: 'Free',
      PREMIUM: 'Premium',
      ENTERPRISE: 'Enterprise'
    };
    return tiers[tier] || tier;
  }
};
