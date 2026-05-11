import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Layout, Zap, ShieldCheck } from 'lucide-react';

import { login as loginApi } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(formData);
      if (res.data?.status === 'success') {
        const { token, staff } = res.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('staffInfo', JSON.stringify(staff));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Left Side - Marketing */}
      <div style={{
        flex: 1.2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 80px',
        color: 'white',
        backgroundImage: `linear-gradient(rgba(30, 64, 175, 0.7), rgba(30, 64, 175, 0.8)), url('/architect_pos_login_bg_1778049102994.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ position: 'absolute', top: '60px', left: '80px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'white', padding: '8px', borderRadius: '12px' }}>
            <Layout size={32} color="#1e40af" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Architect POS</h2>
        </div>

        <h1 style={{ fontSize: '64px', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' }}>
          Kiến tạo tương lai<br />
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>vận hành bán lẻ.</span>
        </h1>

        <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', maxWidth: '500px', marginBottom: '48px', fontWeight: '500' }}>
          Hệ thống quản lý điểm bán hàng chuyên dụng cho các doanh nghiệp kiến trúc, nội thất và bán lẻ cao cấp.
        </p>

        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '20px', flex: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
            <Zap size={24} style={{ marginBottom: '12px', color: '#60a5fa' }} />
            <div style={{ fontWeight: '800', marginBottom: '4px' }}>Tốc độ tối ưu</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Xử lý giao dịch &lt; 1s</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '20px', flex: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
            <ShieldCheck size={24} style={{ marginBottom: '12px', color: '#34d399' }} />
            <div style={{ fontWeight: '800', marginBottom: '4px' }}>Bảo mật đa lớp</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Chuẩn mã hóa ngân hàng</div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{ flex: 0.8, background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 100px' }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginBottom: '40px' }}>Đăng nhập hệ thống</h2>

          {error && (
            <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#ef4444', borderRadius: '10px', marginBottom: '24px', fontSize: '14px', fontWeight: '700', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Số điện thoại hoặc Tên đăng nhập</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Nhập tài khoản của bạn"
                  required
                  disabled={loading}
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '14px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: '600', fontSize: '15px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '14px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: '600', fontSize: '15px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px', borderRadius: '6px' }} /> Ghi nhớ tôi
              </label>
              <a href="#" style={{ color: '#2563eb', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: '#1d4ed8', color: 'white', padding: '18px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 15px -3px rgba(29, 78, 216, 0.3)', transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '48px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
            Chưa có tài khoản cửa hàng? <span onClick={() => navigate('/register')} style={{ color: '#2563eb', fontWeight: '800', cursor: 'pointer' }}>Đăng ký ngay →</span>
          </div>

          <div style={{ marginTop: '80px', display: 'flex', gap: '24px', justifyContent: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: '700' }}>
            <span style={{ cursor: 'pointer' }}>Điều khoản</span>
            <span style={{ cursor: 'pointer' }}>Bảo mật</span>
            <span style={{ cursor: 'pointer' }}>Trợ giúp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
