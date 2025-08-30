import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';

/**
 * Toast notification context for global notifications
 */
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toast.toasts.map(toastItem => (
          <Toast
            key={toastItem.id}
            message={toastItem.message}
            type={toastItem.type}
            onClose={() => toast.removeToast(toastItem.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};