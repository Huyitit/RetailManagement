import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onRowClick,
  onRowDoubleClick,
  isLoading, 
  emptyMessage = "Khong co du lieu",
  pagination
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-white rounded-xl border border-slate-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-500">
        <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-6 py-4 font-semibold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
                className={`hover:bg-slate-50 transition-colors ${onRowClick || onRowDoubleClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 text-slate-800 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-right space-x-3">
                    {onEdit && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                      >
                        Sửa
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                        className="text-red-600 hover:text-red-800 transition-colors font-medium"
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-sm text-slate-500">
            Trang {pagination.currentPage} / {pagination.totalPages} ({pagination.totalItems} kết quả)
          </span>
          <div className="flex gap-2">
            <button 
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="px-3 py-1.5 rounded text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Trang trước
            </button>
            <button 
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="px-3 py-1.5 rounded text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
