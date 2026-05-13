import React from 'react';

const OrdersTable = ({
  columns,
  data,
  isLoading,
  emptyMessage = 'Không có dữ liệu',
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
    color: 'var(--text-light)',
    textTransform: 'uppercase',
    letterSpacing: '0.4px'
  });

  const cellStyle = (align) => ({
    padding: '16px 20px',
    textAlign: align || 'left',
    verticalAlign: 'middle'
  });

  return (
    <div
      style={{
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--surface)'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--page-bg)', borderBottom: '1px solid var(--border-light)' }}>
            {columns.map((col, index) => (
              <th key={index} style={headerCellStyle(col.align)}>
                {col.header}
              </th>
            ))}
            {hasActions && <th style={headerCellStyle('right')}>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={colCount}
                style={{ textAlign: 'center', padding: '36px', color: 'var(--text-light)', fontWeight: 600 }}
              >
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : (!data || data.length === 0) ? (
            <tr>
              <td
                colSpan={colCount}
                style={{ textAlign: 'center', padding: '36px', color: 'var(--text-light)', fontWeight: 600 }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick && onRowClick(row)}
                onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
                style={{
                  borderBottom: '1px solid var(--border-light)',
                  cursor: onRowClick || onRowDoubleClick ? 'pointer' : 'default',
                  transition: 'background 0.2s'
                }}
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
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          Sửa
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--danger)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 1 && (
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-light)',
            background: 'var(--page-bg)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <button
            disabled={pagination.currentPage <= 1}
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              background: 'var(--surface)',
              color: pagination.currentPage <= 1 ? 'var(--text-light)' : 'var(--text-main)',
              fontWeight: 700,
              cursor: pagination.currentPage <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            Trước
          </button>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)' }}>
            Trang <span style={{ color: 'var(--text-main)' }}>{pagination.currentPage}</span> /{' '}
            {pagination.totalPages}
          </div>
          <button
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              background: 'var(--surface)',
              color: pagination.currentPage >= pagination.totalPages ? 'var(--text-light)' : 'var(--text-main)',
              fontWeight: 700,
              cursor: pagination.currentPage >= pagination.totalPages ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
