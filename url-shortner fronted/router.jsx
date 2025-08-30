import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './src/context/AuthContext';

import Layout from './src/components/layout/Layout';

import LoadingSpinner from './src/components/common/LoadingSpinner';
// Import pages

import LandingPage from './src/pages/LandingPage';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Dashboard from './src/pages/Dashboard';
import UrlAnalytics from './src/pages/UrlAnalytics';
import UrlManagement from './src/pages/UrlManagement';
import Analytics from './src/pages/Analytics';
import Profile from './src/pages/Profile';


/**
 * Protected route wrapper
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * Public route wrapper (redirect to dashboard if authenticated)
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

/**
 * Main application router with protected and public routes
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Protected routes with layout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/urls" 
        element={
          <ProtectedRoute>
            <Layout>
              <UrlManagement />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/urls/:shortCode/analytics" 
        element={
          <ProtectedRoute>
            <Layout>
              <UrlAnalytics />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
