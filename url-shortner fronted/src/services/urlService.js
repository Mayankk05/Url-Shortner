import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * URL management service integrating with Spring Boot UrlController
 * Handles URL CRUD operations and statistics
 */
export class UrlService {
  /**
   * Create new shortened URL
   * POST /api/urls
   * Expected: CreateUrlRequest { originalUrl, title?, description?, expiresAt? }
   * Returns: UrlResponse with generated short code and metadata
   */
  static async createUrl(urlData) {
    try {
      const response = await api.post(API_ENDPOINTS.URLS.CREATE, {
        originalUrl: urlData.originalUrl,
        title: urlData.title || '',
        description: urlData.description || '',
        expiresAt: urlData.expiresAt || null
      });

      return response.data; // UrlResponse object
    } catch (error) {
      throw new Error(error.message || 'Failed to create URL');
    }
  }

  /**
   * Get user's URLs with pagination and search
   * GET /api/urls?page=0&size=20&sort=createdAt&direction=desc&search=
   * Returns: Page<UrlResponse> with pagination metadata
   */
  static async getUserUrls(params = {}) {
    try {
      const {
        page = 0,
        size = 20,
        sort = 'createdAt',
        direction = 'desc',
        search = ''
      } = params;

      const response = await api.get(API_ENDPOINTS.URLS.LIST, {
        params: { page, size, sort, direction, search }
      });

      return response.data; // Spring Data Page object
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch URLs');
    }
  }

  /**
   * Get URL details by short code
   * GET /api/urls/{shortCode}
   * Returns: UrlResponse with URL metadata
   */
  static async getUrlDetails(shortCode) {
    try {
      const response = await api.get(`${API_ENDPOINTS.URLS.GET}/${shortCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to get URL details');
    }
  }

  /**
   * Delete URL by short code
   * DELETE /api/urls/{shortCode}
   * Performs soft delete (sets isActive = false)
   */
  static async deleteUrl(shortCode) {
    try {
      const response = await api.delete(`${API_ENDPOINTS.URLS.DELETE}/${shortCode}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete URL');
    }
  }

  /**
   * Get top performing URLs
   * GET /api/urls/top?limit=10
   * Returns: List<UrlResponse> ordered by click count
   */
  static async getTopUrls(limit = 10) {
    try {
      const response = await api.get(API_ENDPOINTS.URLS.TOP, {
        params: { limit }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch top URLs');
    }
  }

  /**
   * Get user statistics
   * GET /api/urls/stats
   * Returns: { totalUrls, totalClicks, subscriptionTier }
   */
  static async getUserStats() {
    try {
      const response = await api.get(API_ENDPOINTS.URLS.STATS);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user statistics');
    }
  }
}