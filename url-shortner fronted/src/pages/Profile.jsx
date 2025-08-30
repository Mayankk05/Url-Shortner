import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { formatters } from '../utils/formatters';
import { SUBSCRIPTION_LIMITS } from '../utils/constants';
import ProfileForm from '../components/forms/ProfileForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * User profile page with account information and settings
 */
const Profile = () => {
  const { user, loading } = useAuthContext();
  const [activeTab, setActiveTab] = useState('profile');

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const subscriptionLimits = SUBSCRIPTION_LIMITS[user.subscriptionTier];

  const tabs = [
    { id: 'profile', name: 'Profile' },
    { id: 'subscription', name: 'Subscription' },
    { id: 'security', name: 'Security' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'profile' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
            <ProfileForm user={user} />
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Subscription Details</h3>
            <div className="space-y-6">
              {/* Current Plan */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {formatters.subscriptionTier(user.subscriptionTier)} Plan
                    </h4>
                    <p className="text-sm text-gray-500">
                      Your current subscription tier
                    </p>
                  </div>
                  {user.subscriptionTier === 'FREE' && (
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                      Upgrade
                    </button>
                  )}
                </div>
              </div>

              {/* Usage Limits */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Usage Limits</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>URLs Created</span>
                      <span>
                        {user.urlCount || 0} / {subscriptionLimits.urls === Infinity ? '∞' : subscriptionLimits.urls}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ 
                          width: subscriptionLimits.urls === Infinity 
                            ? '1%' 
                            : `${Math.min((user.urlCount || 0) / subscriptionLimits.urls * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Analytics History</span>
                      <span>{subscriptionLimits.analytics} days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Plan Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    URL Shortening
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic Analytics
                  </li>
                  {user.subscriptionTier !== 'FREE' && (
                    <>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Custom Short Codes
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Advanced Analytics
                      </li>
                    </>
                  )}
                  {user.subscriptionTier === 'ENTERPRISE' && (
                    <>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        White Label Solution
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        API Access
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
            <div className="space-y-6">
              {/* Password Change */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Update your password to keep your account secure
                </p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                  Change Password
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                  Enable 2FA
                </button>
              </div>

              {/* Session Management */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Active Sessions</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Manage where you're signed in
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-gray-500">
                        {new Date().toLocaleDateString()} - Your current browser
                      </p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;