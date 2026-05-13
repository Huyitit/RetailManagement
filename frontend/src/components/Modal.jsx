import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', bodyClassName = '' }) => {
  // Prevent scrolling on body when modal is open
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

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div 
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.25)] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={`px-8 py-6 overflow-y-auto custom-scrollbar flex-1 ${bodyClassName}`.trim()}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[32px] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
