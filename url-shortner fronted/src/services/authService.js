import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Authentication service integrating with Spring Boot AuthController
 * Handles JWT token management and user session
 */
export class AuthService {
  /**
   * Login user with email and password
   * POST /api/auth/login
   * Expected: LoginRequest { email, password }
   * Returns: AuthResponse { token, userId, email, firstName, lastName, subscriptionTier }
   */
  static async login(credentials) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password
      });

      if (response.success && response.data) {
        // Store JWT token for subsequent requests
        localStorage.setItem('authToken', response.data.token);
        
        // Store user info
        localStorage.setItem('user', JSON.stringify({
          userId: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          subscriptionTier: response.data.subscriptionTier
        }));

        return response.data;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Register new user
   * POST /api/auth/register
   * Expected: RegisterRequest { email, password, firstName, lastName }
   * Returns: { success: true, message: "User registered successfully", userId: number }
   */
  static async register(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Get current user information
   * GET /api/auth/me
   * Requires: Authorization header with JWT token
   * Returns: User object with current user data
   */
  static async getCurrentUser() {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      
      if (response.success && response.data) {
        // Update stored user info
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      throw new Error(error.message || 'Failed to get user information');
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   * Clears local storage and notifies backend
   */
  static async logout() {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with logout even if backend call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Check if user is currently authenticated
   */
  static isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get stored user information
   */
  static getStoredUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }
}