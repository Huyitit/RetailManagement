import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Layout, ShieldCheck, ArrowRight } from 'lucide-react';

import { register as registerApi } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', username: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi(formData);
      if (res.data?.status === 'success') {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Left Side - Profile/Brand */}
      <div style={{
        flex: 1.2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 80px',
        color: 'white',
        backgroundImage: `linear-gradient(rgba(30, 64, 175, 0.7), rgba(30, 64, 175, 0.8)), url('/architect_pos_register_bg_1778049128691.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center'
      }}>
        <div style={{ position: 'absolute', top: '60px', left: '80px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#1e40af', padding: '8px', borderRadius: '12px' }}>
            <Layout size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Architect POS</h2>
        </div>

        <h1 style={{ fontSize: '64px', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' }}>
          Kiến tạo tương lai<br />
          quản lý bán hàng.
        </h1>

        <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', maxWidth: '500px', marginBottom: '48px', fontWeight: '500' }}>
          Gia nhập đội ngũ vận hành hệ thống POS cao cấp nhất. Trải nghiệm sự chuyên nghiệp và tốc độ trong từng thao tác.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', marginLeft: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #111827', marginLeft: '-12px', background: '#ccc', overflow: 'hidden' }}>
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="avatar" style={{ width: '100%', height: '100%' }} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'rgba(255,255,255,0.8)' }}>Hơn <span style={{ color: 'white', fontWeight: '900' }}>500+</span> nhân viên đã gia nhập</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{ flex: 0.8, background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 100px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '440px', width: '100%', padding: '40px 0' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginBottom: '40px' }}>Đăng ký nhân viên</h2>

          {error && (
            <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#ef4444', borderRadius: '10px', marginBottom: '24px', fontSize: '14px', fontWeight: '700', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>HỌ VÀ TÊN</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                  disabled={loading}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: 'none', background: '#f1f5f9', outline: 'none', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>TÊN ĐĂNG NHẬP</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="anv01"
                    required
                    disabled={loading}
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: 'none', background: '#f1f5f9', outline: 'none', fontWeight: '600', fontSize: '14px' }}
                  />
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>SỐ ĐIỆN THOẠI</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="0901 234 567"
                    required
                    disabled={loading}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: 'none', background: '#f1f5f9', outline: 'none', fontWeight: '600', fontSize: '14px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>MẬT KHẨU</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: 'none', background: '#f1f5f9', outline: 'none', fontWeight: '600', fontSize: '14px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>XÁC NHẬN MẬT KHẨU</label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: 'none', background: '#f1f5f9', outline: 'none', fontWeight: '600', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '8px' }}>
              <input type="checkbox" required style={{ width: '18px', height: '18px', marginTop: '2px' }} />
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', lineHeight: '1.5' }}>
                Tôi đồng ý với các <span style={{ color: '#2563eb', cursor: 'pointer' }}>Điều khoản dịch vụ</span> và <span style={{ color: '#2563eb', cursor: 'pointer' }}>Chính sách bảo mật</span> của Architect POS.
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: 'linear-gradient(90deg, #1d4ed8, #6366f1)', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '32px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
            Đã có tài khoản? <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: '800', cursor: 'pointer' }}>Đăng nhập ngay</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
