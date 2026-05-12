import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import {
  ShoppingCart, FileText, Settings,
  Users, BarChart3, Package, Bell
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const staff = JSON.parse(localStorage.getItem('staffInfo') || '{"fullName": "Nhân viên"}');
  
  const [liveStats, setLiveStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    newCustomers: 0,
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
        console.error("Dashboard stats error:", err);
      }
    };
    fetchStats();
  }, []);

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  const stats = [
    { label: 'Doanh thu hôm nay', value: formatMoney(liveStats.todayRevenue), trend: '', color: '#3b82f6' },
    { label: 'Số đơn hoàn thành', value: liveStats.todayOrders, trend: '', color: '#10b981' },
    { label: 'Tổng số khách hàng', value: liveStats.newCustomers, trend: '', color: '#f59e0b' },
    { label: 'Sản phẩm sắp hết', value: liveStats.lowStockCount, trend: '', color: '#ef4444' },
  ];

  const menuItems = [
    { icon: <ShoppingCart size={24} />, label: 'Bán hàng (POS)', path: '/pos', color: '#1d4ed8' },
    { icon: <FileText size={24} />, label: 'Quản lý đơn hàng', path: '/orders', color: '#6366f1' },
    { icon: <Package size={24} />, label: 'Kho & Nhập xuất', path: '/inventory', color: '#10b981' },
    { icon: <Users size={24} />, label: 'Khách hàng', path: '/customers', color: '#f59e0b' },
    { icon: <BarChart3 size={24} />, label: 'Báo cáo doanh thu', path: '/reports', color: '#8b5cf6' },
    { icon: <Settings size={24} />, label: 'Nhân sự & Phân quyền', path: '/staff', color: '#64748b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header style={{ height: '80px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>Tổng quan hệ thống</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Bell size={20} color="#64748b" />
            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', background: '#f1f5f9', borderRadius: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>{staff.fullname || staff.fullName || staff.username || 'Nhân viên'}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{staff.role || 'Cashier'}</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#cbd5e1', overflow: 'hidden' }}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff.fullname || staff.fullName || staff.username || 'N/V')}&background=random`} alt="avatar" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      </header>

      <main className="custom-scrollbar" style={{ padding: '40px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {stats.map((s, idx) => (
            <div key={idx} style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '12px' }}>{s.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>{s.value}</div>
              {s.trend && (
                <div style={{ fontSize: '13px', fontWeight: '800', color: s.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                  {s.trend} <span style={{ color: '#94a3b8', fontWeight: '600' }}>so với hôm qua</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '20px' }}>Công cụ nhanh</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => item.path !== '#' && navigate(item.path)}
              style={{
                background: item.color,
                padding: '24px',
                borderRadius: '24px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: `0 10px 15px -3px ${item.color}44`,
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ background: 'rgba(255,255,255,0.2)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '900' }}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;