import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ReceiptText, ShieldCheck, LogOut, Users, Building2, UserCog, Package, PackageOpen, BarChart3 } from 'lucide-react';

const Sidebar = () => {
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

  return (
    <div style={{
      width: '260px',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      flexShrink: 0
    }}>
      <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <LayoutDashboard size={24} />
        </div>
        <span style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>RETAIL POS</span>
      </div>

      <nav style={{ flex: 1, padding: '0 16px' }}>
        <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', paddingLeft: '8px' }}>Menu chính</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.2s',
                color: isActive ? 'var(--primary)' : '#64748b',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                border: isActive ? '1px solid var(--primary-glow)' : '1px solid transparent'
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          <div style={{ margin: '16px 0', height: '1px', background: '#f1f5f9' }}></div>
          <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>Giao dịch</div>

          <NavLink
            to="/pos"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '800',
              transition: 'all 0.2s',
              color: 'white',
              background: 'var(--primary)',
              boxShadow: '0 4px 12px var(--primary-glow)'
            }}
          >
            <ShoppingCart size={20} />
            Bán hàng (POS)
          </NavLink>
        </div>
      </nav>

      <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9' }}>
        <NavLink
          to="/login"
          onClick={() => localStorage.removeItem('staffInfo')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            background: '#fff1f2',
            color: '#e11d48',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
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