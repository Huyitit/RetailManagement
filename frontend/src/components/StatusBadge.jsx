import React from 'react';

const STATUS_MAP = {
  completed: { tone: 'success', label: 'Hoàn tất' },
  active:    { tone: 'success', label: 'Hoạt động' },
  'còn hạn': { tone: 'success', label: 'Còn hạn' },

  draft:     { tone: 'warning', label: 'Nháp' },
  pending:   { tone: 'warning', label: 'Chờ xử lý' },
  warranty:  { tone: 'warning', label: 'Bảo hành' },

  cancelled:    { tone: 'danger', label: 'Đã hủy' },
  discontinued: { tone: 'danger', label: 'Ngừng KD' },
  'hết hạn':    { tone: 'danger', label: 'Hết hạn' },
  deleted:      { tone: 'danger', label: 'Đã xóa' }
};

const TONE_COLORS = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger:  'var(--danger)',
  neutral: 'var(--text-muted)'
};

const StatusBadge = ({ status }) => {
  const key = (status || '').toLowerCase();
  const { tone, label } = STATUS_MAP[key] || { tone: 'neutral', label: status || '—' };

  return (
    <span className={`tag tag-${tone}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: TONE_COLORS[tone],
          display: 'inline-block'
        }}
      />
      {label}
    </span>
  );
};

export default StatusBadge;
