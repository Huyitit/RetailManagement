import React from 'react';
import OrderDetailModalShell from './OrderDetailModalShell';
import { FormTable, FormRow } from './FormTable';

const ReceiptDetailModal = ({ isOpen, onClose, type, detail, isLoading, error }) => {
  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Number(val || 0)) + ' đ';
  const isImport = type === 'import';

  return (
    <OrderDetailModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isImport ? 'Chi tiết Phiếu Nhập' : 'Chi tiết Phiếu Xuất'}
      size="xl"
    >
      <div className="space-y-6">
        {isLoading && (
          <div className="p-4 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium border border-slate-100">
            Đang tải dữ liệu...
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">
            {error}
          </div>
        )}

        {!isLoading && !error && detail && (
          <>
            <FormTable>
              <FormRow label="Mã phiếu">
                <div className="text-lg font-black text-slate-900">
                  {isImport ? `IMP-${String(detail.receiptId).padStart(5, '0')}` : `EXP-${String(detail.receiptId).padStart(5, '0')}`}
                </div>
              </FormRow>
              <FormRow label="Nhà cung cấp">
                <div className="text-sm font-bold text-slate-800">{detail.supplierName || 'N/A'}</div>
              </FormRow>
              <FormRow label="Ngày lập">
                <div className="text-sm font-semibold text-slate-700">
                  {new Date(isImport ? detail.importDate : detail.exportDate).toLocaleString('vi-VN')}
                </div>
              </FormRow>
              <FormRow label={isImport ? 'Ghi chú' : 'Lý do'}>
                <div className="text-sm text-slate-700">
                  {isImport ? (detail.note || 'Không có ghi chú') : (detail.reason || 'Không có lý do')}
                </div>
              </FormRow>
              <FormRow label="Tổng tiền">
                <div className="text-xl font-black text-indigo-700">{formatMoney(detail.totalAmount)}</div>
              </FormRow>
            </FormTable>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">SKU</th>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">Sản phẩm</th>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-500 w-24 text-center">Số lượng</th>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-500 w-32 text-right">Đơn giá</th>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-500 w-32 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(detail.items || []).map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.skuCode || 'N/A'}</td>
                      <td className="px-4 py-3 text-slate-700">{item.productName || 'N/A'}</td>
                      <td className="px-4 py-3 text-center text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {isImport ? formatMoney(item.importPrice) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {isImport ? formatMoney(item.lineTotal) : '-'}
                      </td>
                    </tr>
                  ))}
                  {(!detail.items || detail.items.length === 0) && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-slate-400">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </>
        )}
      </div>
    </OrderDetailModalShell>
  );
};

export default ReceiptDetailModal;
