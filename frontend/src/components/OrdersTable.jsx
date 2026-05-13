import React from 'react';

const OrdersTable = ({
  columns,
  data,
  isLoading,
  emptyMessage = 'Khong co du lieu',
  onRowClick,
  onRowDoubleClick,
  onEdit,
  onDelete,
  pagination
}) => {
  const hasActions = Boolean(onEdit || onDelete);
  const colCount = columns.length + (hasActions ? 1 : 0);

  const headerCellStyle = (align) => ({
    padding: '14px 20px',
    textAlign: align || 'left',
    fontSize: '11px',
    fontWeight: 800,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.4px'
  });

  const cellStyle = (align) => ({
    padding: '16px 20px',
    textAlign: align || 'left',
    verticalAlign: 'middle'
  });

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '18px', overflow: 'hidden', background: '#ffffff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eef2f7' }}>
            {columns.map((col, index) => (
              <th key={index} style={headerCellStyle(col.align)}>
                {col.header}
              </th>
            ))}
            {hasActions && (
              <th style={headerCellStyle('right')}>Thao tac</th>
            )}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={colCount} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontWeight: 600 }}>
                Dang tai du lieu...
              </td>
            </tr>
          ) : (!data || data.length === 0) ? (
            <tr>
              <td colSpan={colCount} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontWeight: 600 }}>
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick && onRowClick(row)}
              onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
              style={{ borderBottom: '1px solid #f1f5f9', cursor: onRowClick || onRowDoubleClick ? 'pointer' : 'default', transition: 'background 0.2s' }}
              className="table-row-hover"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={cellStyle(col.align)}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
              {hasActions && (
                <td style={cellStyle('right')}>
                  <div style={{ display: 'inline-flex', gap: '12px' }}>
                    {onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                        style={{ border: 'none', background: 'transparent', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Sua
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Xoa
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 1 && (
        <div style={{ padding: '18px 20px', borderTop: '1px solid #eef2f7', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <button
            disabled={pagination.currentPage <= 1}
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: pagination.currentPage <= 1 ? '#cbd5e1' : '#1e293b', fontWeight: 700, cursor: pagination.currentPage <= 1 ? 'not-allowed' : 'pointer', fontSize: '12px' }}
          >
            Truoc
          </button>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#64748b' }}>
            Trang <span style={{ color: '#0f172a' }}>{pagination.currentPage}</span> / {pagination.totalPages}
          </div>
          <button
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: pagination.currentPage >= pagination.totalPages ? '#cbd5e1' : '#1e293b', fontWeight: 700, cursor: pagination.currentPage >= pagination.totalPages ? 'not-allowed' : 'pointer', fontSize: '12px' }}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
