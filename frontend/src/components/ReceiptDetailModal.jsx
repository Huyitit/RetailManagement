import React from 'react';
import OrderDetailModalShell from './OrderDetailModalShell';
import { FormTable, FormRow } from './FormTable';

const ReceiptDetailModal = ({ isOpen, onClose, type, detail, isLoading, error }) => {
  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Number(val || 0)) + ' đ';
  const isImport = type === 'import';

  const notice = (tone, message) => (
    <div
      className={`tag tag-${tone}`}
      style={{
        display: 'block',
        textTransform: 'none',
        letterSpacing: 0,
        fontSize: '14px',
        fontWeight: 600,
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)'
      }}
    >
      {message}
    </div>
  );

  return (
    <OrderDetailModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isImport ? 'Chi tiết Phiếu Nhập' : 'Chi tiết Phiếu Xuất'}
      size="xl"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {isLoading && notice('neutral', 'Đang tải dữ liệu...')}
        {error && notice('danger', error)}

        {!isLoading && !error && detail && (
          <>
            <FormTable>
              <FormRow label="Mã phiếu">
                <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)' }}>
                  {isImport
                    ? `IMP-${String(detail.receiptId).padStart(5, '0')}`
                    : `EXP-${String(detail.receiptId).padStart(5, '0')}`}
                </div>
              </FormRow>
              <FormRow label="Nhà cung cấp">
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {detail.supplierName || 'N/A'}
                </div>
              </FormRow>
              <FormRow label="Ngày lập">
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {new Date(isImport ? detail.importDate : detail.exportDate).toLocaleString('vi-VN')}
                </div>
              </FormRow>
              <FormRow label={isImport ? 'Ghi chú' : 'Lý do'}>
                <div style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                  {isImport ? (detail.note || 'Không có ghi chú') : (detail.reason || 'Không có lý do')}
                </div>
              </FormRow>
              <FormRow label="Tổng tiền">
                <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary)' }}>
                  {formatMoney(detail.totalAmount)}
                </div>
              </FormRow>
            </FormTable>

            <div
              style={{
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--surface)'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead style={{ background: 'var(--page-bg)', borderBottom: '1px solid var(--border-strong)' }}>
                  <tr>
                    {['SKU', 'Sản phẩm', 'Số lượng', 'Đơn giá', 'Thành tiền'].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: '12px 16px',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.4px',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          textAlign: i === 2 ? 'center' : i >= 3 ? 'right' : 'left',
                          width: i === 2 ? '96px' : i >= 3 ? '128px' : undefined
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(detail.items || []).map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {item.skuCode || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>
                        {item.productName || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-main)' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-main)' }}>
                        {isImport ? formatMoney(item.importPrice) : '-'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--text-main)' }}>
                        {isImport ? formatMoney(item.lineTotal) : '-'}
                      </td>
                    </tr>
                  ))}
                  {(!detail.items || detail.items.length === 0) && (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-light)' }}
                      >
                        Không có dữ liệu
                      </td>
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
