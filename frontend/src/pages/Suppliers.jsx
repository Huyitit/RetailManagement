import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api';
import OrdersTable from '../components/OrdersTable';
import OrderDetailModalShell from '../components/OrderDetailModalShell';
import { FormTable, FormRow } from '../components/FormTable';
import { Building2, Plus, Search, Mail, Phone, MapPin } from 'lucide-react';

const Suppliers = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);

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
        alert(err.response?.data?.message || 'Lỗi khi xoá nhà cung cấp');
      }
    }
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
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
      header: 'Nhà Cung Cấp', accessor: 'companyName', render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={avatarStyle}><Building2 size={20} /></div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.companyName}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>MST: {row.taxCode || 'N/A'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Liên hệ', accessor: 'contactName', render: (row) => (
        <div>
          <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{row.contactName}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Phone size={12} /> {row.phone}
          </div>
        </div>
      )
    },
    {
      header: 'Email & Địa chỉ', accessor: 'email', render: (row) => (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {row.email && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={12} /> {row.email}
            </div>
          )}
          {row.address && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={12} /> {row.address}
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Nhà cung cấp</h1>
          <p className="page-subtitle">Quản lý đối tác và thông tin liên hệ nhập hàng</p>
        </div>
        <button type="button" onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={18} /> Thêm NCC
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
                fontWeight: 800,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Danh sách nhà cung cấp
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
                placeholder="Tìm theo tên, sđt, email..."
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
              pagination={{ ...pagination, onPageChange: fetchSuppliers }}
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
            <FormRow label="Tên công ty *">
              <input
                type="text"
                className="input-pill"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="VD: Công ty TNHH ABC"
              />
            </FormRow>
            <FormRow label="Người liên hệ *">
              <input
                type="text"
                className="input-pill"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
            </FormRow>
            <FormRow label="Số điện thoại *">
              <input
                type="text"
                className="input-pill"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </FormRow>
            <FormRow label="Mã số thuế">
              <input
                type="text"
                className="input-pill"
                value={formData.taxCode}
                onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
              />
            </FormRow>
            <FormRow label="Email">
              <input
                type="email"
                className="input-pill"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormRow>
            <FormRow label="Địa chỉ">
              <textarea
                className="input-pill"
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </FormRow>
          </FormTable>
        </div>
      </OrderDetailModalShell>
    </div>
  );
};

export default Suppliers;
