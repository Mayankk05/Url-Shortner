import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Modal component for dialogs and overlays
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeValues = {
    sm: '28rem',  // 448px
    md: '32rem',  // 512px
    lg: '42rem',  // 672px
    xl: '56rem'   // 896px
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0" style={{zIndex: 50, overflowY: 'auto'}}>
      <div className="flex items-center justify-center" style={{minHeight: '100vh', padding: '1rem 1rem 5rem 1rem'}}>
        {/* Backdrop */}
        <div 
          className="fixed top-0 right-0 bottom-0 left-0 bg-gray"
          style={{opacity: 0.75}}
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-lg w-full" 
          style={{maxWidth: sizeValues[size], margin: '2rem 0', position: 'relative'}}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray">
              <h3 className="text-lg font-medium text-gray">
                {title}
              </h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray"
                >
                  <X style={{width: '1.5rem', height: '1.5rem'}} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
