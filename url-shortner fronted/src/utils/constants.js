export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me'
  },
  URLS: {
    CREATE: '/api/urls',
    LIST: '/api/urls',
    GET: '/api/urls',
    DELETE: '/api/urls',
    TOP: '/api/urls/top',
    STATS: '/api/urls/stats'
  },
  ANALYTICS: {
    URL: '/api/analytics',
    DASHBOARD: '/api/analytics/dashboard'
  },
  DEBUG: {
    TEST_JWT: '/api/debug/test-jwt',
    VALIDATE_JWT: '/api/debug/validate-jwt'
  }
};

export const SUBSCRIPTION_TIERS = {
  FREE: 'FREE',
  PREMIUM: 'PREMIUM',
  ENTERPRISE: 'ENTERPRISE'
};

export const SUBSCRIPTION_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: { urls: 100, analytics: 30 },
  [SUBSCRIPTION_TIERS.PREMIUM]: { urls: 10000, analytics: 365 },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: { urls: Infinity, analytics: Infinity }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  URLS: '/urls',
  URL_CREATE: '/urls/create',
  URL_ANALYTICS: '/urls/:shortCode/analytics',
  ANALYTICS: '/analytics',
  PROFILE: '/profile'
};