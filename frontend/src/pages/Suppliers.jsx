import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api';
import DataTable from '../components/DataTable';
import OrderDetailModalShell from '../components/OrderDetailModalShell';
import { Building2, Plus, Search, Mail, Phone, MapPin } from 'lucide-react';

const Suppliers = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: '', contactName: '', phone: '', email: '', address: '', taxCode: ''
  });
  const [error, setError] = useState('');

  const fetchSuppliers = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getSuppliers({ page, limit: 10, q: search });
      if (response.data?.status === 'success') {
        setData(response.data.data);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalItems
        });
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuppliers(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleOpenModal = (supplier = null) => {
    setError('');
    if (supplier) {
      setIsEditMode(true);
      setCurrentSupplier(supplier);
      setFormData({
        companyName: supplier.companyName,
        contactName: supplier.contactName,
        phone: supplier.phone,
        email: supplier.email || '',
        address: supplier.address || '',
        taxCode: supplier.taxCode || ''
      });
    } else {
      setIsEditMode(false);
      setCurrentSupplier(null);
      setFormData({ companyName: '', contactName: '', phone: '', email: '', address: '', taxCode: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.companyName || !formData.contactName || !formData.phone) {
      setError('Tên công ty, người liên hệ và SĐT là bắt buộc.');
      return;
    }

    try {
      if (isEditMode) {
        await updateSupplier(currentSupplier.supplierId, formData);
      } else {
        await createSupplier(formData);
      }
      setIsModalOpen(false);
      fetchSuppliers(pagination.currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.');
    }
  };

  const handleDelete = async (supplier) => {
    if (window.confirm(`Bạn có chắc muốn xóa nhà cung cấp "${supplier.companyName}"?`)) {
      try {
        await deleteSupplier(supplier.supplierId);
        fetchSuppliers(pagination.currentPage);
      } catch (err) {
        alert(err.response?.data?.message || 'Loi khi xoa nha cung cap');
      }
    }
  };

  const columns = [
    { header: 'Nhà Cung Cấp', accessor: 'companyName', render: (row) => (
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mr-3">
          <Building2 size={20} />
        </div>
        <div>
          <div className="font-medium text-slate-900">{row.companyName}</div>
          <div className="text-sm text-slate-500">MST: {row.taxCode || 'N/A'}</div>
        </div>
      </div>
    )},
    { header: 'Liên hệ', accessor: 'contactName', render: (row) => (
      <div>
        <div className="text-slate-800">{row.contactName}</div>
        <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
          <Phone size={12} /> {row.phone}
        </div>
      </div>
    )},
    { header: 'Email & Địa chỉ', accessor: 'email', render: (row) => (
      <div className="text-sm text-slate-600 space-y-1">
        {row.email && <div className="flex items-center gap-1"><Mail size={12}/> {row.email}</div>}
        {row.address && <div className="flex items-center gap-1"><MapPin size={12}/> {row.address}</div>}
      </div>
    )}
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      <header style={{ padding: '32px 40px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Nhà cung cấp</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>Quản lý đối tác và thông tin liên hệ nhập hàng</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ background: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
        >
          <Plus size={18} /> Thêm NCC
        </button>
      </header>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Danh sach nha cung cap</div>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Tìm theo tên, sđt, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: '600' }}
              />
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <DataTable 
              columns={columns} 
              data={data} 
              isLoading={isLoading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              pagination={{
                ...pagination,
                onPageChange: fetchSuppliers
              }}
            />
          </div>
        </div>
      </div>

      <OrderDetailModalShell 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Cập nhật Nhà cung cấp' : 'Thêm Nhà cung cấp'}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
              Hủy
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
              Lưu thông tin
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên công ty *</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Vd: Công ty TNHH ABC" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Người liên hệ *</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại *</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mã số thuế</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.taxCode} onChange={e => setFormData({...formData, taxCode: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
              <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows="2"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
            </div>
          </div>
        </div>
      </OrderDetailModalShell>
    </div>
  );
};

export default Suppliers;
