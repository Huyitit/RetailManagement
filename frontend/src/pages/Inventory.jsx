import React, { useState, useEffect } from 'react';
import { 
  getImportReceipts, createImportReceipt, getImportReceiptById,
  getExportReceipts, createExportReceipt, getExportReceiptById,
  searchSuppliers, searchVariants 
} from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ReceiptDetailModal from '../components/ReceiptDetailModal';
import SearchAutocomplete from '../components/SearchAutocomplete';
import StatusBadge from '../components/StatusBadge';
import { PackageOpen, PackageMinus, Plus, Search, Building2, Layers, Trash2, ArrowRightLeft } from 'lucide-react';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('import'); // 'import' or 'export'
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  // Form State
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [details, setDetails] = useState([]); // { variantId, sku, name, qty, price, currentStock }
  const [notes, setNotes] = useState('');
  const [exportReason, setExportReason] = useState('return_supplier');

  const fetchReceipts = async (page = 1) => {
    setIsLoading(true);
    try {
      let response;
      if (activeTab === 'import') {
        response = await getImportReceipts({ page, limit: 10, q: searchQuery });
      } else {
        response = await getExportReceipts({ page, limit: 10, q: searchQuery });
      }

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
    const delayDebounceFn = setTimeout(() => {
      fetchReceipts(1);
    }, 500);
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
      if (activeTab === 'import') {
        const res = await getImportReceiptById(row.receiptId);
        setDetailData(res.data?.data || null);
      } else {
        const res = await getExportReceiptById(row.receiptId);
        setDetailData(res.data?.data || null);
      }
    } catch (err) {
      setDetailError(err.response?.data?.message || 'Không thể tải chi tiết phiếu.');
    } finally {
      setDetailLoading(false);
    }
  };

  // Autocomplete Search Handlers
  const fetchSuppliersForSearch = async (q) => {
    try {
      const res = await searchSuppliers(q);
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    } catch (e) { return []; }
  };

  const fetchVariantsForSearch = async (q) => {
    try {
      const res = await searchVariants(q);
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    } catch (e) { return []; }
  };

  const handleAddVariant = (variant) => {
    if (details.find(d => d.variantId === variant.variantId)) return; // Already added
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
      setError('Vui lòng chọn Nhà cung cấp.');
      return;
    }

    if (activeTab === 'export' && exportReason === 'return_supplier' && !selectedSupplier) {
      setError('Vui lòng chọn Nhà cung cấp.');
      return;
    }
    if (details.length === 0) {
      setError('Vui lòng thêm ít nhất 1 sản phẩm vào phiếu.');
      return;
    }

    // Validate Export Stock
    if (activeTab === 'export') {
      const invalidItem = details.find(d => Number(d.qty) > d.currentStock);
      if (invalidItem) {
        setError(`Sản phẩm ${invalidItem.sku} không đủ tồn kho (Tồn: ${invalidItem.currentStock}).`);
        return;
      }
    }

    try {
      const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
      const staffId = staffInfo.staffId || 1; // Fallback for dev

      if (activeTab === 'import') {
        const payload = {
          supplierId: selectedSupplier.supplierId,
          note: notes,
          items: details.map(d => ({
            variantId: d.variantId,
            quantity: Number(d.qty),
            importPrice: Number(d.price)
          }))
        };
        await createImportReceipt(payload);
      } else {
        const reasonLabel = exportReason === 'return_supplier'
          ? 'Trả nhà cung cấp'
          : exportReason === 'warranty'
            ? 'Xuất bảo hành'
            : 'Xuất hủy';
        const payload = {
          supplierId: exportReason === 'return_supplier' ? selectedSupplier?.supplierId : undefined,
          reason: notes ? `${reasonLabel}: ${notes}` : reasonLabel,
          items: details.map(d => ({
            variantId: d.variantId,
            quantity: Number(d.qty),
            errorNote: null
          }))
        };
        await createExportReceipt(payload);
      }

      setIsModalOpen(false);
      fetchReceipts(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu phiếu.');
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' đ';

  const columns = activeTab === 'import' ? [
    { header: 'Mã phiếu', accessor: 'receiptId', render: (row) => (
      <div className="font-bold text-slate-800 flex items-center gap-2">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><PackageOpen size={16}/></div>
        IMP-{String(row.receiptId).padStart(5, '0')}
      </div>
    )},
    { header: 'Nhà cung cấp', accessor: 'supplierName', render: (row) => (
      <div className="font-medium text-slate-700">{row.supplierName || 'N/A'}</div>
    )},
    { header: 'Ngày lập', accessor: 'importDate', render: (row) => (
      <div className="text-slate-600 text-sm">{new Date(row.importDate).toLocaleString('vi-VN')}</div>
    )},
    { header: 'Tổng tiền', accessor: 'totalAmount', align: 'right', render: (row) => (
      <div className="font-bold text-slate-900">{formatMoney(row.totalAmount)}</div>
    )}
  ] : [
    { header: 'Mã phiếu', accessor: 'receiptId', render: (row) => (
      <div className="font-bold text-slate-800 flex items-center gap-2">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><PackageMinus size={16}/></div>
        EXP-{String(row.receiptId).padStart(5, '0')}
      </div>
    )},
    { header: 'Nhà cung cấp', accessor: 'supplierName', render: (row) => (
      <div className="text-slate-600">{row.supplierName || 'N/A'}</div>
    )},
    { header: 'Lý do', accessor: 'reason', render: (row) => (
      <div className="text-slate-600 text-sm max-w-[200px] truncate">{row.reason || 'Không có lý do'}</div>
    )},
    { header: 'Ngày lập', accessor: 'exportDate', render: (row) => (
      <div className="text-slate-600 text-sm">{new Date(row.exportDate).toLocaleString('vi-VN')}</div>
    )},
    { header: 'Tổng giá trị xuất', accessor: 'totalAmount', align: 'right', render: (row) => (
      <div className="font-bold text-slate-900">{formatMoney(row.totalAmount)}</div>
    )}
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      <header style={{ padding: '32px 40px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Kho hàng & Tồn kho</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>Quản lý nhập xuất hàng hóa và tính toán tồn kho tự động</p>
        </div>
        <button 
          onClick={handleOpenModal}
          style={{ background: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
        >
          <Plus size={18} /> {activeTab === 'import' ? 'Tạo Phiếu Nhập' : 'Tạo Phiếu Xuất'}
        </button>
      </header>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        
        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => { setActiveTab('import'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'import' 
                ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100 ring-2 ring-indigo-500/20' 
                : 'text-slate-500 hover:bg-white hover:text-slate-700 border border-transparent'
            }`}
          >
            <PackageOpen size={18}/> Phiếu Nhập Kho
          </button>
          <button
            onClick={() => { setActiveTab('export'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'export' 
                ? 'bg-white text-amber-700 shadow-sm border border-amber-100 ring-2 ring-amber-500/20' 
                : 'text-slate-500 hover:bg-white hover:text-slate-700 border border-transparent'
            }`}
          >
            <PackageMinus size={18}/> Phiếu Xuất Kho
          </button>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '24px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder={`Tìm mã phiếu ${activeTab === 'import' ? 'nhập' : 'xuất'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: '600', fontSize: '14px' }}
            />
          </div>

          <DataTable 
            columns={columns} 
            data={data} 
            isLoading={isLoading}
            onRowClick={handleOpenDetail}
            pagination={{ ...pagination, onPageChange: fetchReceipts }}
          />
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'import' ? 'Tạo Phiếu Nhập Kho Mới' : 'Tạo Phiếu Xuất Kho Mới'}
        size="xl"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors">Hủy</button>
            <button onClick={handleSave} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
              Xác nhận {activeTab === 'import' ? 'Nhập Kho' : 'Xuất Kho'}
            </button>
          </>
        }
      >
        <div className="space-y-6">
          {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Col: Info & Search */}
            <div className="space-y-5 md:col-span-1">
              {activeTab === 'export' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Lý do xuất *</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={exportReason}
                    onChange={(e) => { setExportReason(e.target.value); setSelectedSupplier(null); }}
                  >
                    <option value="return_supplier">Trả nhà cung cấp</option>
                    <option value="warranty">Xuất bảo hành</option>
                    <option value="damage">Xuất hủy</option>
                  </select>
                </div>
              )}

              {(activeTab === 'import' || exportReason === 'return_supplier') && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase flex items-center gap-1"><Building2 size={14}/> Nhà cung cấp *</label>
                  {selectedSupplier ? (
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-indigo-100 ring-1 ring-indigo-500/20">
                      <div>
                        <div className="font-bold text-sm text-slate-800">{selectedSupplier.companyName}</div>
                        <div className="text-xs text-slate-500">{selectedSupplier.phone}</div>
                      </div>
                      <button onClick={() => setSelectedSupplier(null)} className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  ) : (
                    <SearchAutocomplete 
                      onSearch={fetchSuppliersForSearch}
                      onSelect={(item) => setSelectedSupplier(item)}
                      placeholder="Tìm nhà cung cấp..."
                      displayValue={(item) => item.companyName}
                      renderItem={(item) => (
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{item.companyName}</div>
                          <div className="text-xs text-slate-500">{item.phone}</div>
                        </div>
                      )}
                    />
                  )}
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase flex items-center gap-1"><Search size={14}/> Tìm sản phẩm *</label>
                <SearchAutocomplete 
                  onSearch={fetchVariantsForSearch}
                  onSelect={handleAddVariant}
                  placeholder="Gõ tên SKU hoặc sản phẩm..."
                  displayValue={(item) => item.skuCode}
                  renderItem={(item) => (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{item.skuCode || 'N/A'}</div>
                        <div className="text-xs text-slate-500">{item.productName}</div>
                      </div>
                      <div className="text-xs font-bold text-indigo-600">Tồn: {item.stockQuantity}</div>
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Ghi chú</label>
                <textarea className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 bg-white" rows="3"
                  value={notes} onChange={e => setNotes(e.target.value)} placeholder="Nhập ghi chú cho phiếu này..."></textarea>
              </div>
            </div>

            {/* Right Col: Grid */}
            <div className="md:col-span-2 flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl bg-white">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                    <tr>
                      <th className="px-4 py-3 font-bold text-slate-600">Sản phẩm</th>
                      <th className="px-4 py-3 font-bold text-slate-600 w-24 text-center">Tồn kho</th>
                      <th className="px-4 py-3 font-bold text-slate-600 w-24">Số lượng</th>
                      <th className="px-4 py-3 font-bold text-slate-600 w-32">Đơn giá</th>
                      <th className="px-4 py-3 font-bold text-slate-600 w-32 text-right">Thành tiền</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {details.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-400">
                          <Layers size={32} className="mx-auto mb-2 opacity-50"/>
                          Chưa có sản phẩm nào trong phiếu.
                        </td>
                      </tr>
                    ) : details.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{item.sku}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[150px]">{item.name}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${item.currentStock > 0 ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-600'}`}>
                            {item.currentStock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" min="1" className={`w-20 border rounded-lg px-2 py-1 text-center text-sm font-bold focus:ring-2 focus:ring-indigo-500 ${activeTab === 'export' && item.qty > item.currentStock ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-slate-200'}`}
                            value={item.qty} onChange={e => updateDetail(idx, 'qty', e.target.value)} />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" min="0" className="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                            value={item.price} onChange={e => updateDetail(idx, 'price', e.target.value)} />
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-indigo-700">
                          {formatMoney(Number(item.qty) * Number(item.price))}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => removeDetail(idx)} className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
                <span className="font-bold text-indigo-900">Tổng cộng ({details.length} mặt hàng):</span>
                <span className="text-xl font-black text-indigo-700">{formatMoney(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

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
