import React, { useState, useEffect } from 'react';
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api';
import OrdersTable from '../components/OrdersTable';
import OrderDetailModalShell from '../components/OrderDetailModalShell';
import { FormTable, FormRow } from '../components/FormTable';
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
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    flexShrink: 0
  };

  const columns = [
    {
      header: 'Khách hàng', accessor: 'fullName', render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={avatarStyle}><Users size={20} /></div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.fullName}</div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px'
              }}
            >
              <Phone size={12} /> {row.phoneNumber}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Email', accessor: 'email', render: (row) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          {row.email ? (<><Mail size={14} /> {row.email}</>) : (<span style={{ color: 'var(--text-light)' }}>Không có</span>)}
        </div>
      )
    },
    {
      header: 'Thẻ thành viên', accessor: 'memberTier', render: (row) => (
        <StatusBadge status={row.memberTier === 'Bronze' ? 'Active' : 'Completed'} />
      )
    },
    {
      header: 'Điểm tích lũy', accessor: 'rewardPoints', align: 'center', render: (row) => (
        <div
          style={{
            fontWeight: 700,
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Award size={16} /> {row.rewardPoints}
        </div>
      )
    }
  ];

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Khách hàng</h1>
          <p className="page-subtitle">Quản lý hồ sơ và điểm tích lũy thành viên</p>
        </div>
        <button type="button" onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={18} /> Thêm khách hàng
        </button>
      </header>

      <div className="page-body custom-scrollbar">
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
              Danh sách khách hàng
            </div>
            <div style={{ position: 'relative', width: '300px' }}>
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
                placeholder="Tìm theo tên, sđt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              pagination={{ ...pagination, onPageChange: fetchCustomers }}
            />
          </div>
        </div>
      </div>

      <OrderDetailModalShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
        footer={
          <>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Hủy</button>
            <button type="button" onClick={handleSave} className="btn-primary">Lưu thông tin</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div
              style={{
                padding: '12px 14px',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(239, 68, 68, 0.25)'
              }}
            >
              {error}
            </div>
          )}
          <FormTable>
            <FormRow label="Họ và tên *">
              <input
                type="text"
                className="input-pill"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </FormRow>
            <FormRow label="Số điện thoại *">
              <input
                type="text"
                className="input-pill"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="0901234567"
              />
            </FormRow>
            <FormRow label="Email">
              <input
                type="email"
                className="input-pill"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="abc@email.com"
              />
            </FormRow>
          </FormTable>
        </div>
      </OrderDetailModalShell>
    </div>
  );
};

export default Customers;
