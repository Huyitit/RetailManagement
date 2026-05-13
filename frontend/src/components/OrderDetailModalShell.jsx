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
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(6px)',
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
          background: '#ffffff',
          width: '100%',
          maxWidth: sizeMap[size] || sizeMap.md,
          borderRadius: '28px',
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.25)',
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
            padding: '22px 28px',
            borderBottom: '1px solid #eef2f7',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)'
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          className={`custom-scrollbar ${bodyClassName}`.trim()}
          style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#ffffff' }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              padding: '18px 28px',
              borderTop: '1px solid #eef2f7',
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
