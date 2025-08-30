import React from 'react';
import { clsx } from 'clsx';

/**
 * Reusable button component with consistent styling
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md';
  
  const variants = {
    primary: 'bg-primary text-white',
    secondary: 'bg-gray text-gray',
    ghost: 'text-gray',
    danger: 'bg-secondary text-white'
  };

  const sizes = {
    sm: 'px-2 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    {
      'opacity-50': disabled || loading,
    },
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin mr-2" style={{width: '1rem', height: '1rem'}} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
