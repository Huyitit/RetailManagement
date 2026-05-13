import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, ReceiptText, LogOut,
  Users, Building2, UserCog, Package, PackageOpen, BarChart3
} from 'lucide-react';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Tổng quan', path: '/dashboard' },
  { icon: <BarChart3 size={20} />, label: 'Báo cáo', path: '/reports' },
  { icon: <ReceiptText size={20} />, label: 'Đơn hàng', path: '/orders' },
  { icon: <Package size={20} />, label: 'Sản phẩm', path: '/products' },
  { icon: <PackageOpen size={20} />, label: 'Kho hàng', path: '/inventory' },
  { icon: <Users size={20} />, label: 'Khách hàng', path: '/customers' },
  { icon: <Building2 size={20} />, label: 'Nhà cung cấp', path: '/suppliers' },
  { icon: <UserCog size={20} />, label: 'Nhân sự', path: '/staff' },
];

const navLinkStyle = ({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: 'var(--radius-md)',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 700,
  transition: 'all 0.2s ease',
  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
  background: isActive ? 'var(--primary-light)' : 'transparent',
  border: `1px solid ${isActive ? 'var(--primary-glow)' : 'transparent'}`
});

const Sidebar = () => {
  const staff = JSON.parse(localStorage.getItem('staffInfo') || '{}');
  const role = staff.role || 'Cashier';

  // Define allowed paths for each role
  const filteredMenuItems = menuItems.filter(item => {
    if (role === 'Admin' || role === 'Owner') return true;
    if (role === 'Manager') return item.path !== '/staff';
    if (role === 'Cashier' || role === 'Staff') {
      return ['/dashboard', '/orders', '/customers'].includes(item.path);
    }
    return false;
  });

  return (
    <div
      style={{
        width: '260px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-strong)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0
      }}
    >
      <div style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            background: 'var(--primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          <LayoutDashboard size={22} />
        </div>
        <span
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-main)',
            letterSpacing: '-0.5px'
          }}
        >
          RETAIL POS
        </span>
      </div>

      <nav style={{ flex: 1, padding: '0 16px' }}>
        <div
          style={{
            color: 'var(--text-light)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px',
            paddingLeft: '8px'
          }}
        >
          Menu chính
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filteredMenuItems.map((item) => (
            <NavLink key={item.path} to={item.path} style={navLinkStyle}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          <div style={{ margin: '16px 0', height: '1px', background: 'var(--border-light)' }} />
          <div
            style={{
              color: 'var(--text-light)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              paddingLeft: '8px'
            }}
          >
            Giao dịch
          </div>

          <NavLink
            to="/pos"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              background: 'var(--primary)',
              boxShadow: 'var(--shadow-primary)'
            }}
          >
            <ShoppingCart size={20} />
            Bán hàng (POS)
          </NavLink>
        </div>
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid var(--border-light)' }}>
        <NavLink
          to="/login"
          onClick={() => localStorage.removeItem('staffInfo')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          <LogOut size={20} />
          Đăng xuất
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
