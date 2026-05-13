import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Lock, Eye, EyeOff, Layout, ShieldCheck, ArrowRight } from 'lucide-react';

import { register as registerApi } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', username: '', phone: '', password: '', confirmPassword: ''
  });
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
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const inputIconStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-light)'
  };

  const fieldLabel = {
    fontSize: '12px',
    fontWeight: 800,
    color: 'var(--text-main)',
    letterSpacing: '0.5px'
  };

  const flatInput = {
    width: '100%',
    padding: '14px 14px 14px 48px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    background: 'var(--surface-muted)',
    outline: 'none',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-sans)'
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
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
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ background: 'var(--primary-hover)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
            <Layout size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
            Architect POS
          </h2>
        </div>

        <h1
          style={{
            fontSize: '56px',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '-1.5px'
          }}
        >
          Kiến tạo tương lai<br />
          quản lý bán hàng.
        </h1>

        <p
          style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '500px',
            marginBottom: '40px',
            fontWeight: 500
          }}
        >
          Gia nhập đội ngũ vận hành hệ thống POS cao cấp nhất. Trải nghiệm sự chuyên nghiệp và tốc độ trong từng thao tác.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', marginLeft: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '3px solid #111827',
                  marginLeft: '-10px',
                  background: '#ccc',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=Staff+${i}&background=random`}
                  alt="staff"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
            Hơn <span style={{ color: 'white', fontWeight: 900 }}>500+</span> nhân viên đã gia nhập
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 0.8,
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 100px',
          overflowY: 'auto'
        }}
      >
        <div style={{ maxWidth: '440px', width: '100%', padding: '40px 0' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '32px' }}>
            Đăng ký nhân viên
          </h2>

          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid rgba(239, 68, 68, 0.25)'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={fieldLabel}>HỌ VÀ TÊN</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={inputIconStyle} />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                  disabled={loading}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={flatInput}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={fieldLabel}>TÊN ĐĂNG NHẬP</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={inputIconStyle} />
                  <input
                    type="text"
                    placeholder="anv01"
                    required
                    disabled={loading}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    style={flatInput}
                  />
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={fieldLabel}>SỐ ĐIỆN THOẠI</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={inputIconStyle} />
                  <input
                    type="text"
                    placeholder="0901 234 567"
                    required
                    disabled={loading}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={flatInput}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={fieldLabel}>MẬT KHẨU</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={inputIconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ ...flatInput, paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-light)'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={fieldLabel}>XÁC NHẬN MẬT KHẨU</label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} style={inputIconStyle} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={flatInput}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '4px' }}>
              <input type="checkbox" required style={{ width: '16px', height: '16px', marginTop: '2px' }} />
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  lineHeight: 1.5
                }}
              >
                Tôi đồng ý với các{' '}
                <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Điều khoản dịch vụ</span> và{' '}
                <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Chính sách bảo mật</span> của Architect POS.
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '16px', fontSize: '15px', marginTop: '10px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'} <ArrowRight size={18} />
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '28px',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Đã có tài khoản?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
            >
              Đăng nhập ngay
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
