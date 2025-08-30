import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Zap, Shield, Globe } from 'lucide-react';
import Button from '../components/common/Button';
import UrlShortener from '../components/features/UrlShortener';

/**
 * Landing page for unauthenticated users
 * Features guest URL shortening and marketing content
 */
const LandingPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create short URLs instantly with our optimized infrastructure'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Track clicks, geography, devices, and more with comprehensive insights'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee'
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Fast redirects worldwide with our global content delivery network'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                URLShort
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Shorten URLs with
              <span className="text-primary-600"> Powerful Analytics</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Create short, memorable links and gain valuable insights into your audience 
              with our comprehensive analytics dashboard.
            </p>
          </div>

          {/* URL Shortener Widget */}
          <div className="mt-12 max-w-2xl mx-auto">
            <UrlShortener />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Professional URL shortening with enterprise-grade features
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center">
                    <Icon className="h-12 w-12 text-primary-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to get started?
          </h2>
          <p className="mt-4 text-xl text-primary-100">
            Join thousands of users who trust URLShort for their link management needs.
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <BarChart3 className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold text-white">
                URLShort
              </span>
            </div>
            <p className="text-gray-400">
              © 2024 URLShort. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;