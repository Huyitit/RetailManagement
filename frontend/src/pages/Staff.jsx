import React, { useState, useEffect } from 'react';
import { getStaffList, createStaff, updateStaff, deactivateStaff, assignStaffRole, resetStaffPassword } from '../services/api';
import OrdersTable from '../components/OrdersTable';
import OrderDetailModalShell from '../components/OrderDetailModalShell';
import { FormTable, FormRow } from '../components/FormTable';
import StatusBadge from '../components/StatusBadge';
import { ShieldCheck, Plus, Search, UserCog } from 'lucide-react';

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
  
  const [formData, setFormData] = useState({ username: '', password: '', fullname: '', phone: '', email: '', role: 'Cashier' });
  const [error, setError] = useState('');

  const fetchStaff = async (page = 1) => {
    setIsLoading(true);
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
        password: '', // Leave blank on edit unless they want to change
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
        alert(err.response?.data?.message || 'Loi khi vo hieu hoa');
      }
    }
  };

  const handleResetPassword = async () => {
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordError('Mat khau moi phai co it nhat 6 ky tu.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mat khau xac nhan khong khop.');
      return;
    }

    try {
      await resetStaffPassword(passwordStaff.staffId, {
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });
      setIsPasswordModalOpen(false);
      alert('Doi mat khau thanh cong.');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Khong the doi mat khau.');
    }
  };

  const columns = [
    { header: 'Nhân viên', accessor: 'fullname', render: (row) => (
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mr-3">
          <UserCog size={20} />
        </div>
        <div>
          <div className="font-medium text-slate-900">{row.fullname}</div>
          <div className="text-sm text-slate-500">@{row.username}</div>
        </div>
      </div>
    )},
    { header: 'Liên hệ', accessor: 'phone', render: (row) => (
      <div className="text-slate-600 text-sm">
        <div>{row.phone}</div>
        {row.email && <div>{row.email}</div>}
      </div>
    )},
    { header: 'Quyền (Role)', accessor: 'role', render: (row) => (
      <StatusBadge status={row.role === 'Admin' ? 'Hoàn tất' : row.role === 'Manager' ? 'Active' : 'Draft'} />
    )},
    { header: 'Mat khau', accessor: 'password', align: 'center', render: (row) => (
      <button
        onClick={(e) => { e.stopPropagation(); handleOpenPasswordModal(row); }}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      >
        Doi mat khau
      </button>
    )}
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      <header style={{ padding: '32px 40px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Nhân sự & Phân quyền</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>Quản lý tài khoản và quyền truy cập hệ thống</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ background: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
        >
          <Plus size={18} /> Thêm Tài Khoản
        </button>
      </header>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Danh sach nhan su</div>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Tìm theo tên, sđt, username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: '600' }}
              />
            </div>
          </div>

          <div style={{ padding: '24px' }}>
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
        title={isEditMode ? 'Cập nhật Nhân viên' : 'Thêm Tài Khoản Mới'}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">Hủy</button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">Lưu thông tin</button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">{error}</div>}
          <FormTable>
            <FormRow label="Họ và tên *">
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={formData.fullname}
                onChange={e => setFormData({ ...formData, fullname: e.target.value })}
              />
            </FormRow>
            <FormRow label={`Tên đăng nhập ${isEditMode ? '' : '*'}`}>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                disabled={isEditMode}
              />
            </FormRow>
            {!isEditMode && (
              <FormRow label="Mật khẩu *">
                <input
                  type="password"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </FormRow>
            )}
            <FormRow label="Số điện thoại *">
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </FormRow>
            <FormRow label="Quyền truy cập">
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
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
        title={`Doi mat khau - ${passwordStaff?.username || ''}`}
        footer={
          <>
            <button onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">Huy</button>
            <button onClick={handleResetPassword} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">Luu thay doi</button>
          </>
        }
      >
        <div className="space-y-4">
          {passwordError && <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">{passwordError}</div>}
          <FormTable>
            <FormRow label="Mat khau moi">
              <input
                type="password"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </FormRow>
            <FormRow label="Xac nhan mat khau moi">
              <input
                type="password"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </FormRow>
          </FormTable>
        </div>
      </OrderDetailModalShell>
    </div>
  );
};

export default Staff;
