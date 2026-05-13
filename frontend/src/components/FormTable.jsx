import React from 'react';

const FormTable = ({ children, style }) => {
  return (
    <div
      style={{
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--surface)',
        ...style
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

const FormRow = ({ label, children, labelStyle, cellStyle }) => {
  return (
    <tr style={{ verticalAlign: 'top', borderBottom: '1px solid var(--border-light)' }}>
      <th
        style={{
          width: '180px',
          padding: '14px 18px',
          textAlign: 'left',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          background: 'var(--page-bg)',
          ...labelStyle
        }}
      >
        {label}
      </th>
      <td style={{ padding: '14px 18px', background: 'var(--surface)', ...cellStyle }}>
        {children}
      </td>
    </tr>
  );
};

export { FormTable, FormRow };
