import React, { useState } from 'react';
import {
  ShieldCheck, Search, QrCode, Phone,
  User, Calendar, AlertCircle, CheckCircle2,
  ArrowRightLeft, RotateCcw, Package, ChevronRight,
  Printer, X, ArrowLeft
} from 'lucide-react';

const Warranty = () => {
  const [searchType, setSearchType] = useState('phone');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('search');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [processingType, setProcessingType] = useState(null);
  const [reason, setReason] = useState('');
  const [newProductSku, setNewProductSku] = useState('');

  const mockWarrantyInfo = {
    customer: { name: 'Nguyễn Văn A', phone: '0901234567', tier: 'Gold' },
    product: {
      name: 'MacBook Air M2',
      serial: 'APL-M2-8899',
      purchaseDate: '15/01/2026',
      warrantyExpiry: '15/01/2027',
      status: 'In Warranty',
      conditions: [
        'Lỗi do nhà sản xuất',
        'Còn nguyên tem niêm phong',
        'Không bị vào nước hoặc rơi vỡ'
      ]
    },
    history: [
      { date: '15/01/2026', action: 'Mua mới', note: 'Kèm gói bảo hành VIP' }
    ]
  };

  const handleSearch = () => {
    if (!query) return;

    setSelectedProduct(mockWarrantyInfo);
    setView('detail');
  };

  const handleProcess = () => {
    setView('success');
  };

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      {}
      <header style={{ padding: '32px 40px', background: 'white', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {view !== 'search' && (
            <button onClick={() => setView(view === 'success' ? 'search' : 'detail')} style={{ border: 'none', background: '#f1f5f9', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
              <ArrowLeft size={20} color="#64748b" />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Xử lý Bảo hành</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>Tiếp nhận, kiểm tra và đổi trả sản phẩm lỗi</p>
          </div>
        </div>
      </header>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', justifyContent: 'center' }}>

        {view === 'search' && (
          <div style={{ width: '600px', textAlign: 'center', marginTop: '40px' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 32px auto' }}>
              <ShieldCheck size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', marginBottom: '12px' }}>Kiểm tra thông tin bảo hành</h2>
            <p style={{ color: '#64748b', fontWeight: '600', marginBottom: '40px' }}>Nhập số điện thoại khách hàng hoặc mã Serial sản phẩm</p>

            <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '14px', marginBottom: '24px' }}>
                <button
                  onClick={() => setSearchType('phone')}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: searchType === 'phone' ? 'white' : 'transparent', color: searchType === 'phone' ? 'var(--primary)' : '#64748b', fontWeight: '800', cursor: 'pointer', boxShadow: searchType === 'phone' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Phone size={18} /> Số điện thoại
                </button>
                <button
                  onClick={() => setSearchType('serial')}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: searchType === 'serial' ? 'white' : 'transparent', color: searchType === 'serial' ? 'var(--primary)' : '#64748b', fontWeight: '800', cursor: 'pointer', boxShadow: searchType === 'serial' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <QrCode size={18} /> Mã Serial / IMEI
                </button>
              </div>

              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <Search size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder={searchType === 'phone' ? "Nhập SĐT khách hàng..." : "Quét hoặc nhập mã Serial..."}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ width: '100%', padding: '20px 20px 20px 60px', borderRadius: '20px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '18px', fontWeight: '700' }}
                />
              </div>

              <button
                onClick={handleSearch}
                style={{ width: '100%', padding: '20px', borderRadius: '20px', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)' }}
              >
                Tìm kiếm thông tin
              </button>
            </div>
          </div>
        )}

        {view === 'detail' && selectedProduct && (
          <div style={{ width: '900px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {}
              <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: '950', color: '#0f172a', margin: '0 0 8px 0' }}>{selectedProduct.product.name}</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Serial: <b>{selectedProduct.product.serial}</b></span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Mua ngày: <b>{selectedProduct.product.purchaseDate}</b></span>
                    </div>
                  </div>
                  <div style={{ background: '#ecfdf5', color: '#059669', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '900' }}>
                    {selectedProduct.product.status}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>Điều kiện bảo hành</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {selectedProduct.product.conditions.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                        <CheckCircle2 size={16} color="#10b981" /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {}
              <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '24px' }}>Lịch sử bảo hành & Sửa chữa</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {selectedProduct.history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: '20px', paddingBottom: '24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', zIndex: 1 }}></div>
                        {i < selectedProduct.history.length - 1 && <div style={{ width: '2px', flex: 1, background: '#e2e8f0' }}></div>}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{h.action}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginTop: '2px' }}>{h.date} • {h.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {}
              <div style={{ background: 'var(--primary)', padding: '24px', borderRadius: '32px', color: 'white', boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={28} /></div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '900' }}>{selectedProduct.customer.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: '700' }}>{selectedProduct.customer.tier} Member</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} />
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>{selectedProduct.customer.phone}</span>
                </div>
              </div>

              {}
              <div style={{ background: 'white', padding: '24px', borderRadius: '32px', border: '1px solid #e2e8f0', flex: 1 }}>
                <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '20px' }}>Thao tác xử lý</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => { setProcessingType('exchange'); setView('processing'); }}
                    style={{ width: '100%', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: '800', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><ArrowRightLeft size={20} /></div>
                    Đổi sản phẩm mới
                  </button>
                  <button
                    onClick={() => { setProcessingType('return'); setView('processing'); }}
                    style={{ width: '100%', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: '800', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <div style={{ width: '40px', height: '40px', background: '#fff1f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}><RotateCcw size={20} /></div>
                    Trả hàng hoàn tiền
                  </button>
                </div>

                <div style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: '8px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                    <AlertCircle size={16} color="#f59e0b" />
                    <span>Vui lòng kiểm tra kỹ tình trạng vật lý trước khi xác nhận.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'processing' && (
          <div style={{ width: '600px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', marginBottom: '32px', textAlign: 'center' }}>
              {processingType === 'exchange' ? 'Xử lý Đổi sản phẩm mới' : 'Xử lý Trả hàng hoàn tiền'}
            </h2>

            <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {processingType === 'exchange' ? (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '8px' }}>QUÉT MÃ VẠCH SẢN PHẨM THAY THẾ</label>
                  <div style={{ position: 'relative' }}>
                    <QrCode size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Quét mã vạch sản phẩm mới..."
                      value={newProductSku}
                      onChange={(e) => setNewProductSku(e.target.value)}
                      style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px', border: '2px solid #f1f5f9', outline: 'none', fontWeight: '700' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fff1f2', padding: '24px', borderRadius: '24px', border: '1px dashed #fda4af' }}>
                  <label style={{ fontSize: '11px', fontWeight: '900', color: '#e11d48', display: 'block', marginBottom: '8px' }}>SỐ TIỀN HOÀN LẠI DỰ KIẾN</label>
                  <div style={{ fontSize: '32px', fontWeight: '950', color: '#e11d48' }}>{formatMoney(25900000)}</div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '8px' }}>LÝ DO LỖI CHI TIẾT</label>
                <textarea
                  placeholder="Ví dụ: Lỗi sọc màn hình, pin ảo..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '2px solid #f1f5f9', outline: 'none', fontWeight: '600', height: '120px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button onClick={() => setView('detail')} style={{ padding: '18px', borderRadius: '16px', border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '800', cursor: 'pointer' }}>Hủy bỏ</button>
                <button onClick={handleProcess} style={{ padding: '18px', borderRadius: '16px', border: 'none', background: '#10b981', color: 'white', fontWeight: '800', cursor: 'pointer' }}>Xác nhận Xử lý</button>
              </div>
            </div>
          </div>
        )}

        {view === 'success' && (
          <div style={{ width: '500px', textAlign: 'center', marginTop: '40px' }}>
            <div style={{ width: '100px', height: '100px', background: '#10b981', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 32px auto', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle2 size={48} strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '950', color: '#1e293b', marginBottom: '12px' }}>Xử lý hoàn tất!</h2>
            <p style={{ color: '#64748b', fontWeight: '600', marginBottom: '40px', lineHeight: '1.6' }}>
              Hệ thống đã cập nhật tồn kho và kích hoạt bảo hành mới cho khách hàng. Biên lai đang được in tự động.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{ width: '100%', padding: '20px', borderRadius: '20px', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '18px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><Printer size={20} /> In biên lai bảo hành</button>
              <button onClick={() => setView('search')} style={{ width: '100%', padding: '18px', borderRadius: '20px', border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '16px', fontWeight: '800', cursor: 'pointer' }}>Trở về Trang chủ</button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default Warranty;
