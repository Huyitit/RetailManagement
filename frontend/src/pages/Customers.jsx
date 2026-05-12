import React, { useState, useEffect } from 'react';
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { Users, Plus, Search, Mail, Phone, Award } from 'lucide-react';

const Customers = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', email: '' });
  const [error, setError] = useState('');

  const fetchCustomers = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getAllCustomers({ page, limit: 10, q: search });
      if (response.data?.status === 'success') {
        setData(response.data.data);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalItems
        });
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleOpenModal = (customer = null) => {
    setError('');
    if (customer) {
      setIsEditMode(true);
      setCurrentCustomer(customer);
      setFormData({
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        email: customer.email || ''
      });
    } else {
      setIsEditMode(false);
      setCurrentCustomer(null);
      setFormData({ fullName: '', phoneNumber: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.phoneNumber) {
      setError('Họ tên và Số điện thoại là bắt buộc.');
      return;
    }

    try {
      if (isEditMode) {
        await updateCustomer(currentCustomer.customerId, formData);
      } else {
        await createCustomer(formData);
      }
      setIsModalOpen(false);
      fetchCustomers(pagination.currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.');
    }
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${customer.fullName}"?`)) {
      try {
        await deleteCustomer(customer.customerId);
        fetchCustomers(pagination.currentPage);
      } catch (err) {
        alert(err.response?.data?.message || 'Loi khi xoa');
      }
    }
  };

  const columns = [
    { header: 'Khách hàng', accessor: 'fullName', render: (row) => (
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
          <Users size={20} />
        </div>
        <div>
          <div className="font-medium text-slate-900">{row.fullName}</div>
          <div className="text-sm text-slate-500 flex items-center gap-1">
            <Phone size={12} /> {row.phoneNumber}
          </div>
        </div>
      </div>
    )},
    { header: 'Email', accessor: 'email', render: (row) => (
      <div className="text-slate-600 flex items-center gap-1">
        {row.email ? <><Mail size={14}/> {row.email}</> : <span className="text-slate-400">Không có</span>}
      </div>
    )},
    { header: 'Thẻ thành viên', accessor: 'memberTier', render: (row) => (
      <StatusBadge status={row.memberTier === 'Bronze' ? 'Active' : 'Completed'} />
    )},
    { header: 'Điểm tích lũy', accessor: 'rewardPoints', align: 'center', render: (row) => (
      <div className="font-semibold text-indigo-600 flex items-center justify-center gap-1">
        <Award size={16} /> {row.rewardPoints}
      </div>
    )}
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      <header style={{ padding: '32px 40px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Khách hàng</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>Quản lý hồ sơ và điểm tích lũy thành viên</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ background: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
        >
          <Plus size={18} /> Thêm Khách Hàng
        </button>
      </header>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '24px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, sđt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: '600', fontSize: '14px' }}
            />
          </div>

          <DataTable 
            columns={columns} 
            data={data} 
            isLoading={isLoading}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            pagination={{ ...pagination, onPageChange: fetchCustomers }}
          />
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Cập nhật Khách hàng' : 'Thêm Khách hàng'}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">Hủy</button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">Lưu thông tin</button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên *</label>
            <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Nguyễn Văn A" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại *</label>
            <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} placeholder="0901234567" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="abc@email.com" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Customers;
