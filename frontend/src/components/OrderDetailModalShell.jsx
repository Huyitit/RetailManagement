import React, { useEffect } from 'react';

const OrderDetailModalShell = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  bodyClassName = ''
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

  if (!isOpen) return null;

  const sizeMap = {
    sm: '480px',
    md: '680px',
    lg: '900px',
    xl: '1120px',
    full: '1280px'
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: '24px'
      }}
    >
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0 }}
      />
      <div
        style={{
          background: 'white',
          width: '100%',
          maxWidth: sizeMap[size] || sizeMap.md,
          borderRadius: '32px',
          boxShadow: '0 25px 70px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          position: 'relative'
        }}
      >
        <div
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f8fafc',
              width: '40px',
              height: '40px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          className={`custom-scrollbar ${bodyClassName}`.trim()}
          style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              padding: '20px 32px',
              borderTop: '1px solid #f1f5f9',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModalShell;
