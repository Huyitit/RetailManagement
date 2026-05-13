import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const sizeMap = {
  sm: '480px',
  md: '680px',
  lg: '900px',
  xl: '1120px',
  full: '1280px'
};

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
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ padding: '24px', zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: sizeMap[size] || sizeMap.md,
          border: '1px solid var(--border-strong)'
        }}
      >
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid var(--border-light)',
            background: 'var(--page-bg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            style={{
              border: '1px solid var(--border-strong)',
              background: 'var(--surface)',
              width: '36px',
              height: '36px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-light)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          className={`custom-scrollbar ${bodyClassName}`.trim()}
          style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: 'var(--surface)' }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              padding: '16px 28px',
              borderTop: '1px solid var(--border-light)',
              background: 'var(--page-bg)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              flexShrink: 0
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
