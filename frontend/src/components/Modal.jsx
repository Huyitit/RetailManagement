import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SIZE_TO_WIDTH = {
  sm: '480px',
  md: '640px',
  lg: '880px',
  xl: '1100px',
  full: '1280px'
};

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', bodyClassName = '' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: SIZE_TO_WIDTH[size] || SIZE_TO_WIDTH.md }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 28px',
            borderBottom: '1px solid var(--border-light)',
            flexShrink: 0
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--surface-muted)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className={`custom-scrollbar ${bodyClassName}`.trim()}
          style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              padding: '18px 28px',
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

export default Modal;
