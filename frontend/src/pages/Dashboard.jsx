import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import {
  ShoppingCart, FileText, Settings, Users, BarChart3, Package, Bell
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const staff = JSON.parse(localStorage.getItem('staffInfo') || '{"fullName": "Nhân viên"}');

  const [liveStats, setLiveStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    totalCustomers: 0,
    lowStockCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (res.data?.status === 'success') {
          setLiveStats(res.data.data);
        }
      } catch (err) {
        console.error('Dashboard stats error:', err);
      }
    };
    fetchStats();
  }, []);

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  const stats = [
    { label: 'Doanh thu hôm nay', value: formatMoney(liveStats.todayRevenue) },
    { label: 'Số đơn hoàn thành', value: liveStats.todayOrders },
    { label: 'Tổng số khách hàng', value: liveStats.totalCustomers, roles: ['Admin', 'Owner', 'Manager'] },
    { label: 'Sản phẩm sắp hết', value: liveStats.lowStockCount, roles: ['Admin', 'Owner', 'Manager'] }
  ].filter(s => !s.roles || s.roles.includes(staff.role || 'Cashier'));

  const allMenuItems = [
    { icon: <ShoppingCart size={22} />, label: 'Bán hàng (POS)', path: '/pos' },
    { icon: <FileText size={22} />, label: 'Quản lý đơn hàng', path: '/orders' },
    { icon: <Package size={22} />, label: 'Kho & Nhập xuất', path: '/inventory', roles: ['Admin', 'Owner', 'Manager'] },
    { icon: <Users size={22} />, label: 'Khách hàng', path: '/customers' },
    { icon: <BarChart3 size={22} />, label: 'Báo cáo doanh thu', path: '/reports', roles: ['Admin', 'Owner', 'Manager'] },
    { icon: <Settings size={22} />, label: 'Nhân sự & Phân quyền', path: '/staff', roles: ['Admin', 'Owner'] }
  ];

  const menuItems = allMenuItems.filter(item => !item.roles || item.roles.includes(staff.role || 'Cashier'));

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Tổng quan hệ thống</h1>
          <p className="page-subtitle">Hiệu suất hôm nay và các công cụ vận hành nhanh</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 14px',
              background: 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                {staff.fullname || staff.fullName || staff.username || 'Nhân viên'}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                {staff.role || 'Cashier'}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--border-strong)',
                overflow: 'hidden'
              }}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff.fullname || staff.fullName || staff.username || 'N/V')}&background=random`}
                alt="avatar"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="page-body custom-scrollbar">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}
        >
          {stats.map((s, idx) => (
            <div key={idx} className="surface-card" style={{ padding: '24px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: '10px'
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.3px'
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '16px',
            letterSpacing: '-0.2px'
          }}
        >
          Công cụ nhanh
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}
        >
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="surface-card"
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--primary-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              <div
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
