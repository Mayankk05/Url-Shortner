import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

/**
 * Authentication hook providing user state and auth methods
 * Integrates with Spring Boot JWT authentication
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const storedUser = AuthService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
            // Optionally refresh user data from backend
            try {
              const currentUser = await AuthService.getCurrentUser();
              setUser(currentUser);
            } catch (refreshError) {
              // If refresh fails, use stored data
              console.warn('Failed to refresh user data:', refreshError);
            }
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await AuthService.login(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await AuthService.register(userData);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      // Logout should always succeed locally
      console.warn('Logout error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };
};
