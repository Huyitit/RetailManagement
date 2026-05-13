import React, { useState } from 'react';
import {
  ShieldCheck, Search, QrCode, Phone,
  User, AlertCircle, CheckCircle2,
  ArrowRightLeft, RotateCcw,
  Printer, ArrowLeft
} from 'lucide-react';

const Warranty = () => {
  const [searchType, setSearchType] = useState('phone');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('search');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [processingType, setProcessingType] = useState(null);
  const [reason, setReason] = useState('');
  const [newProductSku, setNewProductSku] = useState('');

  const handleSearch = () => {
    if (!query) return;
    alert('Chức năng đang được cập nhật...');

  };

  const handleProcess = () => setView('success');

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  const sectionLabelStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-light)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const segmentStyle = (active) => ({
    flex: 1,
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: active ? 'var(--surface)' : 'transparent',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: active ? 'var(--shadow-sm)' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  });

  return (
    <div className="page-shell">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {view !== 'search' && (
            <button
              type="button"
              onClick={() => setView(view === 'success' ? 'search' : 'detail')}
              style={{
                border: '1px solid var(--border-strong)',
                background: 'var(--surface-muted)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="page-title">Xử lý bảo hành</h1>
            <p className="page-subtitle">Tiếp nhận, kiểm tra và đổi trả sản phẩm lỗi</p>
          </div>
        </div>
      </header>

      <div
        className="page-body custom-scrollbar"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {view === 'search' && (
          <div style={{ width: '600px', textAlign: 'center', marginTop: '32px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary-light)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                margin: '0 auto 28px auto'
              }}
            >
              <ShieldCheck size={36} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
              Kiểm tra thông tin bảo hành
            </h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '32px' }}>
              Nhập số điện thoại khách hàng hoặc mã Serial sản phẩm
            </p>

            <div
              className="surface-card"
              style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  background: 'var(--surface-muted)',
                  padding: '4px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setSearchType('phone')}
                  style={segmentStyle(searchType === 'phone')}
                >
                  <Phone size={18} /> Số điện thoại
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('serial')}
                  style={segmentStyle(searchType === 'serial')}
                >
                  <QrCode size={18} /> Mã Serial / IMEI
                </button>
              </div>

              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <Search
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '18px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
                <input
                  type="text"
                  placeholder={searchType === 'phone' ? 'Nhập SĐT khách hàng...' : 'Quét hoặc nhập mã Serial...'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-pill"
                  style={{
                    padding: '18px 16px 18px 52px',
                    fontSize: '16px',
                    fontWeight: 700
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="btn-primary"
                style={{ width: '100%', padding: '18px', fontSize: '15px' }}
              >
                Tìm kiếm thông tin
              </button>
            </div>
          </div>
        )}

        {view === 'detail' && selectedProduct && (
          <div style={{ width: '900px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="surface-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                      {selectedProduct.product.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Serial: <b>{selectedProduct.product.serial}</b>
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Mua ngày: <b>{selectedProduct.product.purchaseDate}</b>
                      </span>
                    </div>
                  </div>
                  <div className="tag tag-success" style={{ fontSize: '12px', padding: '6px 12px' }}>
                    {selectedProduct.product.status}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                  <h4 style={{ ...sectionLabelStyle, marginBottom: '14px' }}>Điều kiện bảo hành</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {selectedProduct.product.conditions.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--text-main)'
                        }}
                      >
                        <CheckCircle2 size={16} color="var(--success)" /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="surface-card" style={{ padding: '28px' }}>
                <h4 style={{ ...sectionLabelStyle, marginBottom: '20px' }}>Lịch sử bảo hành & sửa chữa</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {selectedProduct.history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: '18px', paddingBottom: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            zIndex: 1
                          }}
                        />
                        {i < selectedProduct.history.length - 1 && (
                          <div style={{ width: '2px', flex: 1, background: 'var(--border-strong)' }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                          {h.action}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-light)',
                            fontWeight: 600,
                            marginTop: '2px'
                          }}
                        >
                          {h.date} • {h.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  background: 'var(--primary)',
                  padding: '22px',
                  borderRadius: 'var(--radius-xl)',
                  color: 'white',
                  boxShadow: 'var(--shadow-primary)'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <User size={26} />
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 700 }}>{selectedProduct.customer.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.85, fontWeight: 700 }}>
                      {selectedProduct.customer.tier} Member
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(0,0,0,0.15)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Phone size={16} />
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{selectedProduct.customer.phone}</span>
                </div>
              </div>

              <div className="surface-card" style={{ padding: '22px', flex: 1 }}>
                <h4 style={{ ...sectionLabelStyle, marginBottom: '16px' }}>Thao tác xử lý</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setProcessingType('exchange'); setView('processing'); }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-strong)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--primary-light)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)'
                      }}
                    >
                      <ArrowRightLeft size={18} />
                    </div>
                    Đổi sản phẩm mới
                  </button>
                  <button
                    type="button"
                    onClick={() => { setProcessingType('return'); setView('processing'); }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-strong)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--danger-bg)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--danger)'
                      }}
                    >
                      <RotateCcw size={18} />
                    </div>
                    Trả hàng hoàn tiền
                  </button>
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'var(--warning-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(245, 158, 11, 0.25)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    <AlertCircle size={16} color="var(--warning)" />
                    <span>Vui lòng kiểm tra kỹ tình trạng vật lý trước khi xác nhận.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'processing' && (
          <div style={{ width: '600px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '28px', textAlign: 'center' }}>
              {processingType === 'exchange' ? 'Xử lý đổi sản phẩm mới' : 'Xử lý trả hàng hoàn tiền'}
            </h2>

            <div
              className="surface-card"
              style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {processingType === 'exchange' ? (
                <div>
                  <label style={{ ...sectionLabelStyle, display: 'block', marginBottom: '8px' }}>
                    Quét mã vạch sản phẩm thay thế
                  </label>
                  <div style={{ position: 'relative' }}>
                    <QrCode
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-light)'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Quét mã vạch sản phẩm mới..."
                      value={newProductSku}
                      onChange={(e) => setNewProductSku(e.target.value)}
                      className="input-pill"
                      style={{ padding: '14px 16px 14px 48px', fontWeight: 700 }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: 'var(--danger-soft-bg)',
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px dashed rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <label style={{ ...sectionLabelStyle, color: 'var(--danger)', display: 'block', marginBottom: '6px' }}>
                    Số tiền hoàn lại dự kiến
                  </label>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--danger)' }}>
                    {formatMoney(25900000)}
                  </div>
                </div>
              )}

              <div>
                <label style={{ ...sectionLabelStyle, display: 'block', marginBottom: '8px' }}>
                  Lý do lỗi chi tiết
                </label>
                <textarea
                  placeholder="Ví dụ: Lỗi sọc màn hình, pin ảo..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input-pill"
                  style={{ padding: '14px 16px', height: '120px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <button type="button" onClick={() => setView('detail')} className="btn-secondary" style={{ padding: '14px' }}>
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleProcess}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'var(--success)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Xác nhận xử lý
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'success' && (
          <div style={{ width: '500px', textAlign: 'center', marginTop: '32px' }}>
            <div
              style={{
                width: '92px',
                height: '92px',
                background: 'var(--success)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                margin: '0 auto 28px auto',
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
              }}
            >
              <CheckCircle2 size={44} strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
              Xử lý hoàn tất!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '32px', lineHeight: 1.6 }}>
              Hệ thống đã cập nhật tồn kho và kích hoạt bảo hành mới cho khách hàng. Biên lai đang được in tự động.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button type="button" className="btn-primary" style={{ padding: '18px', fontSize: '15px' }}>
                <Printer size={20} /> In biên lai bảo hành
              </button>
              <button type="button" onClick={() => setView('search')} className="btn-secondary" style={{ padding: '14px' }}>
                Trở về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Warranty;
