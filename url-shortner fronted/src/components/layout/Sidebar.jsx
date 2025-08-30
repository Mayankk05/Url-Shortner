import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Link as LinkIcon, 
  Home, 
  User, 
  Plus 
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { formatters } from '../../utils/formatters';

/**
 * Sidebar navigation for authenticated users
 */
const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthContext();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My URLs', href: '/urls', icon: LinkIcon },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="bg-white shadow-sm sticky top-0" style={{width: '16rem', height: '100vh'}}>
      <div className="p-6">
        {/* User info */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="rounded-full bg-primary flex items-center justify-center" style={{width: '2.5rem', height: '2.5rem'}}>
              <span className="text-sm font-medium text-white">
                {user?.firstName?.[0] || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray">
                {formatters.subscriptionTier(user?.subscriptionTier)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick action */}
        <Link
          to="/urls/create"
          className="w-full flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-primary mb-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create URL
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-gray text-primary border-r-2 border-primary'
                    : 'text-gray'
                }`}
              >
                <Icon style={{width: '1.25rem', height: '1.25rem', marginRight: '0.75rem'}} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;