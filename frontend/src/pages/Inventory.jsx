import React, { useState, useEffect } from 'react';
import {
  getImportReceipts, createImportReceipt, getImportReceiptById,
  getExportReceipts, createExportReceipt, getExportReceiptById,
  searchSuppliers, searchVariants
} from '../services/api';
import OrdersTable from '../components/OrdersTable';
import OrderDetailModalShell from '../components/OrderDetailModalShell';
import { FormTable, FormRow } from '../components/FormTable';
import ReceiptDetailModal from '../components/ReceiptDetailModal';
import SearchAutocomplete from '../components/SearchAutocomplete';
import { PackageOpen, PackageMinus, Plus, Search, Building2, Layers, Trash2 } from 'lucide-react';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [details, setDetails] = useState([]);
  const [notes, setNotes] = useState('');
  const [exportReason, setExportReason] = useState('return_supplier');

  const fetchReceipts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = activeTab === 'import'
        ? await getImportReceipts({ page, limit: 10, q: searchQuery })
        : await getExportReceipts({ page, limit: 10, q: searchQuery });
      if (response.data?.status === 'success') {
        setData(response.data.data);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalItems
        });
      }
    } catch (err) {
      console.error('Failed to fetch receipts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchReceipts(1); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);

  const handleOpenModal = () => {
    setError('');
    setSelectedSupplier(null);
    setDetails([]);
    setNotes('');
    setExportReason('return_supplier');
    setIsModalOpen(true);
  };

  const handleOpenDetail = async (row) => {
    setDetailError('');
    setDetailLoading(true);
    setDetailData(null);
    setIsDetailOpen(true);
    try {
      const res = activeTab === 'import'
        ? await getImportReceiptById(row.receiptId)
        : await getExportReceiptById(row.receiptId);
      setDetailData(res.data?.data || null);
    } catch (err) {
      setDetailError(err.response?.data?.message || 'Không thể tải chi tiết phiếu.');
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchSuppliersForSearch = async (q) => {
    try {
      const res = await searchSuppliers(q);
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    } catch { return []; }
  };

  const fetchVariantsForSearch = async (q) => {
    try {
      const res = await searchVariants(q);
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    } catch { return []; }
  };

  const handleAddVariant = (variant) => {
    if (details.find((d) => d.variantId === variant.variantId)) return;
    const defaultPrice = activeTab === 'import'
      ? Number(variant.importPrice || 0)
      : Number(variant.sellPrice || 0);
    setDetails([...details, {
      variantId: variant.variantId,
      sku: variant.skuCode || 'N/A',
      name: variant.productName || 'Unknown',
      currentStock: Number(variant.stockQuantity || 0),
      qty: 1,
      price: defaultPrice
    }]);
  };

  const updateDetail = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const removeDetail = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const totalAmount = details.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);

  const handleSave = async () => {
    if (activeTab === 'import' && !selectedSupplier) {
      setError('Vui lòng chọn Nhà cung cấp.'); return;
    }
    if (activeTab === 'export' && exportReason === 'return_supplier' && !selectedSupplier) {
      setError('Vui lòng chọn Nhà cung cấp.'); return;
    }
    if (details.length === 0) {
      setError('Vui lòng thêm ít nhất 1 sản phẩm vào phiếu.'); return;
    }
    if (activeTab === 'import') {
      const invalidItem = details.find((d) => {
        const qty = Number(d.qty); const price = Number(d.price);
        return !Number.isFinite(qty) || !Number.isInteger(qty) || qty <= 0 || !Number.isFinite(price) || price < 0;
      });
      if (invalidItem) {
        setError(`Sản phẩm ${invalidItem.sku} có số lượng hoặc giá nhập không hợp lệ.`); return;
      }
    }
    if (activeTab === 'export') {
      const invalidItem = details.find((d) => Number(d.qty) > d.currentStock);
      if (invalidItem) {
        setError(`Sản phẩm ${invalidItem.sku} không đủ tồn kho (Tồn: ${invalidItem.currentStock}).`); return;
      }
    }

    try {
      if (activeTab === 'import') {
        await createImportReceipt({
          supplierId: selectedSupplier.supplierId,
          note: notes,
          items: details.map((d) => ({
            variantId: d.variantId,
            quantity: Number.parseInt(d.qty, 10),
            importPrice: Number(d.price)
          }))
        });
      } else {
        const reasonLabel = exportReason === 'return_supplier'
          ? 'Trả nhà cung cấp'
          : exportReason === 'warranty'
            ? 'Xuất bảo hành'
            : 'Xuất hủy';
        await createExportReceipt({
          supplierId: exportReason === 'return_supplier' ? selectedSupplier?.supplierId : undefined,
          reason: notes ? `${reasonLabel}: ${notes}` : reasonLabel,
          items: details.map((d) => ({
            variantId: d.variantId,
            quantity: Number(d.qty),
            errorNote: null
          }))
        });
      }
      setIsModalOpen(false);
      fetchReceipts(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu phiếu.');
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' đ';

  const codeChipStyle = (tone) => ({
    padding: '8px',
    borderRadius: 'var(--radius-sm)',
    background: tone === 'import' ? 'var(--primary-light)' : 'var(--warning-bg)',
    color: tone === 'import' ? 'var(--primary)' : 'var(--warning)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const columns = activeTab === 'import' ? [
    {
      header: 'Mã phiếu', accessor: 'receiptId', render: (row) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: 600, color: 'var(--text-main)' }}>
          <div style={codeChipStyle('import')}><PackageOpen size={16} /></div>
          IMP-{String(row.receiptId).padStart(5, '0')}
        </div>
      )
    },
    {
      header: 'Nhà cung cấp', accessor: 'supplierName', render: (row) => (
        <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{row.supplierName || 'N/A'}</div>
      )
    },
    {
      header: 'Ngày lập', accessor: 'importDate', render: (row) => (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(row.importDate).toLocaleString('vi-VN')}</div>
      )
    },
    {
      header: 'Tổng tiền', accessor: 'totalAmount', align: 'right', render: (row) => (
        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatMoney(row.totalAmount)}</div>
      )
    }
  ] : [
    {
      header: 'Mã phiếu', accessor: 'receiptId', render: (row) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: 600, color: 'var(--text-main)' }}>
          <div style={codeChipStyle('export')}><PackageMinus size={16} /></div>
          EXP-{String(row.receiptId).padStart(5, '0')}
        </div>
      )
    },
    {
      header: 'Nhà cung cấp', accessor: 'supplierName', render: (row) => (
        <div style={{ color: 'var(--text-muted)' }}>{row.supplierName || 'N/A'}</div>
      )
    },
    {
      header: 'Lý do', accessor: 'reason', render: (row) => (
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '13px',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {row.reason || 'Không có lý do'}
        </div>
      )
    },
    {
      header: 'Ngày lập', accessor: 'exportDate', render: (row) => (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(row.exportDate).toLocaleString('vi-VN')}</div>
      )
    },
    {
      header: 'Tổng giá trị xuất', accessor: 'totalAmount', align: 'right', render: (row) => (
        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatMoney(row.totalAmount)}</div>
      )
    }
  ];

  const tabStyle = (active) => ({
    padding: '10px 22px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    background: active ? 'var(--primary)' : 'var(--surface)',
    color: active ? 'white' : 'var(--text-muted)',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderColor: active ? 'var(--primary)' : 'var(--border-strong)',
    boxShadow: active ? 'var(--shadow-primary)' : 'none',
    transition: 'all 0.2s ease'
  });

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Kho hàng & Tồn kho</h1>
          <p className="page-subtitle">Quản lý nhập xuất hàng hóa và tính toán tồn kho tự động</p>
        </div>
        <button type="button" onClick={handleOpenModal} className="btn-primary">
          <Plus size={18} /> {activeTab === 'import' ? 'Tạo phiếu nhập' : 'Tạo phiếu xuất'}
        </button>
      </header>

      <div className="page-body custom-scrollbar">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('import'); setSearchQuery(''); }}
            style={tabStyle(activeTab === 'import')}
          >
            <PackageOpen size={18} /> Phiếu nhập kho
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('export'); setSearchQuery(''); }}
            style={tabStyle(activeTab === 'export')}
          >
            <PackageMinus size={18} /> Phiếu xuất kho
          </button>
        </div>

        <div className="surface-card-flush">
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Danh sách phiếu
            </div>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
              <input
                type="text"
                placeholder={`Tìm mã phiếu ${activeTab === 'import' ? 'nhập' : 'xuất'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-pill"
                style={{ paddingLeft: '44px', background: 'var(--page-bg)' }}
              />
            </div>
          </div>

          <div style={{ padding: '20px 24px' }}>
            <OrdersTable
              columns={columns}
              data={data}
              isLoading={isLoading}
              onRowClick={handleOpenDetail}
              pagination={{ ...pagination, onPageChange: fetchReceipts }}
            />
          </div>
        </div>
      </div>

      <OrderDetailModalShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'import' ? 'Tạo phiếu nhập kho mới' : 'Tạo phiếu xuất kho mới'}
        size="xl"
        footer={
          <>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Hủy</button>
            <button type="button" onClick={handleSave} className="btn-primary">
              Xác nhận {activeTab === 'import' ? 'nhập kho' : 'xuất kho'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div
              style={{
                padding: '14px 16px',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid rgba(239, 68, 68, 0.25)'
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '20px' }}>
            <div>
              <FormTable>
                {activeTab === 'export' && (
                  <FormRow label="Lý do xuất *">
                    <select
                      className="input-pill"
                      value={exportReason}
                      onChange={(e) => { setExportReason(e.target.value); setSelectedSupplier(null); }}
                    >
                      <option value="return_supplier">Trả nhà cung cấp</option>
                      <option value="warranty">Xuất bảo hành</option>
                      <option value="damage">Xuất hủy</option>
                    </select>
                  </FormRow>
                )}

                {(activeTab === 'import' || exportReason === 'return_supplier') && (
                  <FormRow label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Building2 size={14} /> Nhà cung cấp *</span>}>
                    {selectedSupplier ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--primary-light)',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--primary-glow)'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                            {selectedSupplier.companyName}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {selectedSupplier.phone}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedSupplier(null)}
                          aria-label="Bỏ chọn"
                          className="hover-red"
                          style={{
                            border: '1px solid var(--border-strong)',
                            background: 'var(--surface)',
                            color: 'var(--text-light)',
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <SearchAutocomplete
                        onSearch={fetchSuppliersForSearch}
                        onSelect={(item) => setSelectedSupplier(item)}
                        placeholder="Tìm nhà cung cấp..."
                        displayValue={(item) => item.companyName}
                        renderItem={(item) => (
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>
                              {item.companyName}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.phone}</div>
                          </div>
                        )}
                      />
                    )}
                  </FormRow>
                )}

                <FormRow label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Search size={14} /> Tìm sản phẩm *</span>}>
                  <SearchAutocomplete
                    onSearch={fetchVariantsForSearch}
                    onSelect={handleAddVariant}
                    placeholder="Gõ tên SKU hoặc sản phẩm..."
                    displayValue={(item) => item.skuCode}
                    renderItem={(item) => (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>
                            {item.skuCode || 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.productName}</div>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
                          Tồn: {item.stockQuantity}
                        </div>
                      </div>
                    )}
                  />
                </FormRow>

                <FormRow label="Ghi chú">
                  <textarea
                    className="input-pill"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập ghi chú cho phiếu này..."
                  />
                </FormRow>
              </FormTable>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--surface)'
                }}
                className="custom-scrollbar"
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                  <thead
                    style={{
                      background: 'var(--page-bg)',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      borderBottom: '1px solid var(--border-strong)'
                    }}
                  >
                    <tr>
                      {['Sản phẩm', 'Tồn kho', 'Số lượng', 'Đơn giá', 'Thành tiền', ''].map((h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: '12px 16px',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.4px',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            textAlign: i === 1 || i === 2 ? 'center' : i >= 3 && i < 5 ? (i === 4 ? 'right' : 'left') : 'left',
                            width: i === 1 ? '90px' : i === 2 ? '90px' : i === 3 || i === 4 ? '130px' : i === 5 ? '40px' : undefined
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {details.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--text-light)' }}>
                          <Layers size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.5 }} />
                          Chưa có sản phẩm nào trong phiếu.
                        </td>
                      </tr>
                    ) : details.map((item, idx) => {
                      const overstock = activeTab === 'export' && Number(item.qty) > item.currentStock;
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }} className="table-row-hover">
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.sku}</div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                maxWidth: '150px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.name}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span className={`tag ${item.currentStock > 0 ? 'tag-neutral' : 'tag-danger'}`}>
                              {item.currentStock}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <input
                              type="number"
                              min="1"
                              className="input-pill"
                              value={item.qty}
                              onChange={(e) => updateDetail(idx, 'qty', e.target.value)}
                              style={{
                                width: '88px',
                                padding: '8px 10px',
                                textAlign: 'center',
                                fontWeight: 600,
                                background: overstock ? 'var(--danger-bg)' : 'var(--surface)',
                                color: overstock ? 'var(--danger)' : 'var(--text-main)',
                                borderColor: overstock ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-strong)'
                              }}
                            />
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <input
                              type="number"
                              min="0"
                              className="input-pill"
                              value={item.price}
                              onChange={(e) => updateDetail(idx, 'price', e.target.value)}
                              style={{ padding: '8px 10px', fontWeight: 700 }}
                            />
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>
                            {formatMoney(Number(item.qty) * Number(item.price))}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => removeDetail(idx)}
                              aria-label="Xóa sản phẩm"
                              className="hover-red"
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--text-light)',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  marginTop: '14px',
                  padding: '16px 20px',
                  background: 'var(--primary-light)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--primary-glow)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  Tổng cộng ({details.length} mặt hàng):
                </span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                  {formatMoney(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </OrderDetailModalShell>

      <ReceiptDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        type={activeTab}
        detail={detailData}
        isLoading={detailLoading}
        error={detailError}
      />
    </div>
  );
};

export default Inventory;
