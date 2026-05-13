import React, { useState, useEffect } from 'react';
import {
  getStaffList, createStaff, updateStaff, deactivateStaff, assignStaffRole, resetStaffPassword
} from '../services/api';
import OrdersTable from '../components/OrdersTable';
import OrderDetailModalShell from '../components/OrderDetailModalShell';
import { FormTable, FormRow } from '../components/FormTable';
import StatusBadge from '../components/StatusBadge';
import { Plus, Search, UserCog } from 'lucide-react';

const Staff = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordStaff, setPasswordStaff] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');

  const [formData, setFormData] = useState({
    username: '', password: '', fullname: '', phone: '', email: '', role: 'Cashier'
  });
  const [error, setError] = useState('');

  const [tableError, setTableError] = useState('');

  const fetchStaff = async (page = 1) => {
    setIsLoading(true);
    setTableError('');
    try {
      const response = await getStaffList({ page, limit: 10, q: search });
      if (response.data?.status === 'success') {
        setData(response.data.data);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalItems
        });
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      if (err.response?.status === 403) {
        setTableError('Bạn không có quyền (Admin/Owner) để xem danh sách nhân sự.');
      } else {
        setTableError(err.response?.data?.message || 'Lỗi kết nối máy chủ.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStaff(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleOpenModal = (staff = null) => {
    setError('');
    if (staff) {
      setIsEditMode(true);
      setCurrentStaff(staff);
      setFormData({
        username: staff.username,
        password: '',
        fullname: staff.fullname,
        phone: staff.phone,
        email: staff.email || '',
        role: staff.role
      });
    } else {
      setIsEditMode(false);
      setCurrentStaff(null);
      setFormData({ username: '', password: '', fullname: '', phone: '', email: '', role: 'Cashier' });
    }
    setIsModalOpen(true);
  };

  const handleOpenPasswordModal = (staff) => {
    setPasswordStaff(staff);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setIsPasswordModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.fullname || !formData.phone || (!isEditMode && (!formData.username || !formData.password))) {
      setError('Vui lòng điền đủ thông tin bắt buộc.');
      return;
    }
    try {
      if (isEditMode) {
        await updateStaff(currentStaff.staffId, {
          fullname: formData.fullname, phone: formData.phone, email: formData.email
        });
        if (formData.role !== currentStaff.role) {
          await assignStaffRole(currentStaff.staffId, { role: formData.role });
        }
      } else {
        await createStaff(formData);
      }
      setIsModalOpen(false);
      fetchStaff(pagination.currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  const handleDelete = async (staff) => {
    if (window.confirm(`Bạn có chắc muốn vô hiệu hóa tài khoản "${staff.username}"?`)) {
      try {
        await deactivateStaff(staff.staffId);
        fetchStaff(pagination.currentPage);
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi vô hiệu hoá');
      }
    }
  };

  const handleResetPassword = async () => {
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }
    try {
      await resetStaffPassword(passwordStaff.staffId, {
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });
      setIsPasswordModalOpen(false);
      alert('Đổi mật khẩu thành công.');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Không thể đổi mật khẩu.');
    }
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--surface-muted)',
    color: 'var(--text-muted)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    flexShrink: 0
  };

  const columns = [
    {
      header: 'Nhân viên', accessor: 'fullname', render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={avatarStyle}><UserCog size={20} /></div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.fullname}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>@{row.username}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Liên hệ', accessor: 'phone', render: (row) => (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{row.phone}</div>
          {row.email && <div style={{ marginTop: '2px' }}>{row.email}</div>}
        </div>
      )
    },
    {
      header: 'Quyền (Role)', accessor: 'role', render: (row) => {
        let bgColor = 'var(--surface-muted)';
        let color = 'var(--text-main)';
        if (row.role === 'Admin' || row.role === 'Owner') {
          bgColor = 'rgba(59, 130, 246, 0.1)';
          color = '#3b82f6';
        } else if (row.role === 'Manager') {
          bgColor = 'rgba(16, 185, 129, 0.1)';
          color = '#10b981';
        } else if (row.role === 'Cashier') {
          bgColor = 'rgba(245, 158, 11, 0.1)';
          color = '#f59e0b';
        }
        
        return (
          <span style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: bgColor,
            color: color,
            display: 'inline-block'
          }}>
            {row.role}
          </span>
        );
      }
    },
    {
      header: 'Mật khẩu', accessor: 'password', align: 'center', render: (row) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleOpenPasswordModal(row); }}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          Đổi mật khẩu
        </button>
      )
    }
  ];

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Nhân sự & Phân quyền</h1>
          <p className="page-subtitle">Quản lý tài khoản và quyền truy cập hệ thống</p>
        </div>
        <button type="button" onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={18} /> Thêm tài khoản
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
              Danh sách nhân sự
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
                placeholder="Tìm theo tên, sđt, username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-pill"
                style={{ paddingLeft: '44px', background: 'var(--page-bg)' }}
              />
            </div>
          </div>

          <div style={{ padding: '20px 24px' }}>
            {tableError && (
              <div
                style={{
                  padding: '16px',
                  marginBottom: '20px',
                  background: 'var(--danger-bg)',
                  color: 'var(--danger)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ⚠️ {tableError}
              </div>
            )}
            <OrdersTable
              columns={columns}
              data={data}
              isLoading={isLoading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              pagination={{ ...pagination, onPageChange: fetchStaff }}
            />
          </div>
        </div>
      </div>

      <OrderDetailModalShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Cập nhật nhân viên' : 'Thêm tài khoản mới'}
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
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              />
            </FormRow>
            <FormRow label={`Tên đăng nhập ${isEditMode ? '' : '*'}`}>
              <input
                type="text"
                className="input-pill"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={isEditMode}
                style={isEditMode ? { background: 'var(--surface-muted)', color: 'var(--text-light)' } : undefined}
              />
            </FormRow>
            {!isEditMode && (
              <FormRow label="Mật khẩu *">
                <input
                  type="password"
                  className="input-pill"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </FormRow>
            )}
            <FormRow label="Số điện thoại *">
              <input
                type="text"
                className="input-pill"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </FormRow>
            <FormRow label="Quyền truy cập">
              <select
                className="input-pill"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Cashier">Cashier (Thu ngân)</option>
                <option value="Manager">Manager (Quản lý)</option>
                <option value="Admin">Admin (Quản trị)</option>
              </select>
            </FormRow>
          </FormTable>
        </div>
      </OrderDetailModalShell>

      <OrderDetailModalShell
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title={`Đổi mật khẩu - ${passwordStaff?.username || ''}`}
        footer={
          <>
            <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="btn-secondary">Huỷ</button>
            <button type="button" onClick={handleResetPassword} className="btn-primary">Lưu thay đổi</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {passwordError && (
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
              {passwordError}
            </div>
          )}
          <FormTable>
            <FormRow label="Mật khẩu mới">
              <input
                type="password"
                className="input-pill"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </FormRow>
            <FormRow label="Xác nhận mật khẩu mới">
              <input
                type="password"
                className="input-pill"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </FormRow>
          </FormTable>
        </div>
      </OrderDetailModalShell>
    </div>
  );
};

export default Staff;
