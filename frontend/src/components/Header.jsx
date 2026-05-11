import { LogOut } from 'lucide-react';

const Header = () => {
  return (
    <header className="top-header">
      <div className="header-brand">
        <h1 className="header-main-title">Hệ thống Quản lý</h1>
        <p className="header-sub-title">Quản lý bán hàng doanh nghiệp Việt Nam</p>
      </div>

      <div className="header-right-side">
        <div className="user-profile-box">
          <div className="user-text-info">
            <span className="user-name-text">Quản lý cửa hàng</span>
            <span className="user-role-text">Admin</span>
          </div>
          <div className="user-avatar-circle">M</div>
        </div>
        <button className="header-logout-btn">
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Header;