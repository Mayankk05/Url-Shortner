import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Analytics service integrating with Spring Boot AnalyticsController
 * Handles detailed analytics and dashboard data
 */
export class AnalyticsService {
  /**
   * Get comprehensive analytics for a specific URL
   * GET /api/analytics/{shortCode}?days=30
   * Returns: AnalyticsResponse with detailed metrics
   */
  static async getUrlAnalytics(shortCode, days = 30) {
    try {
      const response = await api.get(`${API_ENDPOINTS.ANALYTICS.URL}/${shortCode}`, {
        params: { days }
      });

      return response.data; // AnalyticsResponse object
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch analytics');
    }
  }

  /**
   * Get user dashboard analytics
   * GET /api/analytics/dashboard
   * Returns: Aggregated analytics across all user URLs
   */
  static async getDashboardAnalytics() {
    try {
      const response = await api.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch dashboard analytics');
    }
  }

  /**
   * Export analytics data
   * GET /api/analytics/{shortCode}/export?format=csv&days=30
   */
  static async exportAnalytics(shortCode, format = 'csv', days = 30) {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.ANALYTICS.URL}/${shortCode}/export`,
        {
          params: { format, days },
          responseType: 'blob'
        }
      );

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to export analytics');
    }
  }
}