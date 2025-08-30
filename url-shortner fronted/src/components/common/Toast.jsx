import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Toast notification component for user feedback
 */
const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      className: 'border bg-white text-primary',
      iconClassName: 'text-primary'
    },
    error: {
      icon: XCircle,
      className: 'border bg-white text-secondary',
      iconClassName: 'text-secondary'
    },
    warning: {
      icon: AlertCircle,
      className: 'border bg-white text-gray',
      iconClassName: 'text-gray'
    },
    info: {
      icon: Info,
      className: 'border bg-white text-primary',
      iconClassName: 'text-primary'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={clsx(
      'w-full shadow-md rounded-md overflow-hidden',
      config.className
    )} style={{maxWidth: '24rem'}}>
      <div className="p-4">
        <div className="flex items-start">
          <div>
            <Icon className={clsx(config.iconClassName)} style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;