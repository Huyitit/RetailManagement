import React from 'react';

const StatCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div
      className="surface-card"
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}
      >
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            {title}
          </p>
          <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.3px', margin: 0 }}>
            {value}
          </h3>
        </div>
        {icon && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || (trend !== undefined && trend !== null)) && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
          {(trend !== undefined && trend !== null) && (
            <span
              className={`tag tag-${trend > 0 ? 'success' : 'danger'}`}
              style={{ marginRight: '8px' }}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          {subtitle && (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
