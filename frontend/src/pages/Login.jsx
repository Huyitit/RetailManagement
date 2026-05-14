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

  const inputWrap = { position: 'relative' };
  const inputIconStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-light)'
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
          backgroundImage: `linear-gradient(rgba(30, 64, 175, 0.7), rgba(30, 64, 175, 0.8)), url('/architect_pos_login_bg_1778049102994.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
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
          <div style={{ background: 'white', padding: '8px', borderRadius: 'var(--radius-md)' }}>
            <Layout size={28} color="var(--primary-hover)" />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            Architect POS
          </h2>
        </div>

        <h1
          style={{
            fontSize: '80px',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '-1.5px'
          }}
        >
          Kiến tạo tương lai<br />
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>vận hành bán lẻ.</span>
        </h1>

        <p
          style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '500px',
            marginBottom: '40px',
            fontWeight: 500
          }}
        >
          Hệ thống quản lý cho cửa hàng máy tính, điện thoại, thiết bị điện máy 
        </p>

        <div style={{ display: 'flex', gap: '20px' }}>
          {/* <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '22px',
              borderRadius: 'var(--radius-lg)',
              flex: 1,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Zap size={22} style={{ marginBottom: '10px', color: '#60a5fa' }} />
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Tốc độ tối ưu</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Xử lý giao dịch &lt; 1s</div>
          </div> */}
          {/* <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '22px',
              borderRadius: 'var(--radius-lg)',
              flex: 1,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <ShieldCheck size={22} style={{ marginBottom: '10px', color: '#34d399' }} />
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Bảo mật đa lớp</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Chuẩn mã hóa ngân hàng</div>
          </div> */}
        </div>
      </div>

      <div
        style={{
          flex: 0.8,
          background: 'var(--page-bg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 100px'
        }}
      >
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '32px' }}>
            Đăng nhập hệ thống
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                Số điện thoại hoặc Tên đăng nhập
              </label>
              <div style={inputWrap}>
                <User size={18} style={inputIconStyle} />
                <input
                  type="text"
                  placeholder="Nhập tài khoản của bạn"
                  required
                  disabled={loading}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-pill"
                  style={{ paddingLeft: '48px', padding: '16px 16px 16px 48px', fontSize: '15px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Mật khẩu</label>
              <div style={inputWrap}>
                <Lock size={18} style={inputIconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-pill"
                  style={{ paddingLeft: '48px', padding: '16px 48px 16px 48px', fontSize: '15px' }}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                <input type="checkbox" style={{ width: '16px', height: '16px' }} /> Ghi nhớ tôi
              </label>
              <a
                href="#"
                style={{
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  textDecoration: 'none'
                }}
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '16px', fontSize: '15px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>



          <div
            style={{
              marginTop: '60px',
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              color: 'var(--text-light)',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
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
