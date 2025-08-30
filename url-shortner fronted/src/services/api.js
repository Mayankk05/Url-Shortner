import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

/**
 * Main Axios instance with interceptors for authentication and error handling
 * Integrates with Spring Boot backend running on localhost:8080
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Backend expects: Authorization: Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle backend response format
api.interceptors.response.use(
  (response) => {
    // Backend returns: { success: true, data: {...}, message: "..." }
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Backend error format: { success: false, error: "message" }
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'An unexpected error occurred';
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export default api;