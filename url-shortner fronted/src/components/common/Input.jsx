import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Reusable input component with validation support
 */
const Input = forwardRef(({
  label,
  error,
  helpText,
  className = '',
  ...props
}, ref) => {
  const inputClasses = clsx(
    'block w-full px-3 py-2 border rounded-md shadow-sm text-sm',
    {
      'border-gray': !error,
      'border-primary': error,
    },
    className
  );

  return (
    <div className="mb-2">
      {label && (
        <label className="block text-sm font-medium text-gray mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-secondary mt-1">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray mt-1">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;