import React, { useState, useEffect } from 'react';
import {
  X, Printer, Edit3, Trash2, CheckCircle2,
  ChevronRight, AlertCircle, ArrowLeft,
  History, ShieldCheck, FileText, Calendar,
  Clock, RotateCcw, User, CreditCard, Tag,
  ShoppingBag, RefreshCw, Wallet, Info, Settings2, QrCode
} from 'lucide-react';
import { getOrder, processReturn } from '../services/api';

const OrderDetailModal = ({ receiptId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('detail');
  const [view, setView] = useState('detail');
  const [returnItems, setReturnItems] = useState({});
  const [refundAmount, setRefundAmount] = useState(0);
  const [returnReason, setReturnReason] = useState('');
  const [includeVat, setIncludeVat] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
  const [processType, setProcessType] = useState('Warranty');
  const [warrantyType, setWarrantyType] = useState('Replacement');

  const getWarrantyStatus = (orderDateStr, warrantyMonths) => {
    if (!orderDateStr) return { expired: false, text: `Còn bảo hành (${warrantyMonths || 12} tháng)` };

    const orderDate = new Date(orderDateStr.replace('Z', ''));
    const months = parseInt(warrantyMonths) || 12;

    const expirationDate = new Date(orderDate);
    expirationDate.setMonth(expirationDate.getMonth() + months);

    const now = new Date();
    if (now > expirationDate) return { expired: true, text: 'Hết hạn bảo hành' };

    const diffMonths = (expirationDate.getFullYear() - now.getFullYear()) * 12 + (expirationDate.getMonth() - now.getMonth());

    if (diffMonths > 0) {
      return { expired: false, text: `Còn bảo hành (${diffMonths} tháng)` };
    } else {

      const diffTime = expirationDate - now;
      const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      return { expired: false, text: `Còn bảo hành (${diffDays} ngày)` };
    }
  };

  const formatLocalDate = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr.replace('Z', ''));
    return dateObj.toLocaleString('vi-VN');
  };

  const PRIMARY_BLUE = '#3b82f6';
  const SUCCESS_GREEN = '#10b981';
  const SOFT_RED = '#fef2f2';
  const BORDER_RED = '#f87171';
  const TEXT_RED = '#ef4444';

  useEffect(() => {
    if (receiptId) fetchOrderDetail();
  }, [receiptId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOrder(receiptId);
      if (res.data?.status === 'success') {
        const data = res.data.data;
        setOrder(data);

        const items = {};
        if (data.items) {
          data.items.forEach(item => {
            items[item.variantId] = item.quantity;
          });
        }
        setReturnItems(items);
        calculateRefund(items, includeVat, data.items);

        setProcessType('Warranty');
      } else {
        setError(`Lỗi từ API (${res.status}): ${res.data?.message || "Không tìm thấy dữ liệu"}`);
      }
    } catch (err) {
      setError(`Lỗi kết nối: ${err.message}. Kiểm tra Backend http://127.0.0.1:5000`);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  const calculateRefund = (newItems, vat, orderItems) => {
    let total = 0;
    const items = orderItems || order?.items;
    if (items) {
      items.forEach(item => {

        total += (item.finalPrice || 0) * (newItems[item.variantId] || 0);
      });
    }
    if (vat) total *= 1.1;
    setRefundAmount(Math.round(total));
  };

  const handleProcessTypeChange = (type) => {
    setProcessType('Warranty');
    const newItems = { ...returnItems };
    order.items.forEach(item => {
      newItems[item.variantId] = 0;
    });
    setReturnItems(newItems);
    calculateRefund(newItems, includeVat);
  };

  const handleReturnQtyChange = (vId, val, max) => {
    const qty = Math.min(Math.max(0, parseInt(val) || 0), max);
    const newItems = { ...returnItems, [vId]: qty };
    setReturnItems(newItems);
    calculateRefund(newItems, includeVat);
  };

  const handleVatToggle = () => {
    const newVat = !includeVat;
    setIncludeVat(newVat);
    calculateRefund(returnItems, newVat);
  };

  const handleProcessReturn = async () => {
    if (!returnReason.trim()) {
      alert("Vui lòng nhập lý do sửa đổi!");
      return;
    }
    try {
      const itemsToReturn = Object.entries(returnItems)
        .filter(([_, qty]) => qty > 0)
        .map(([vId, qty]) => ({ variantId: parseInt(vId), returnQty: qty }));

      let currentStaffId = 1;
      const savedStaff = localStorage.getItem('staffInfo');
      if (savedStaff) {
        const parsed = JSON.parse(savedStaff);
        currentStaffId = parsed.staffId || 1;
      }

      const res = await processReturn(receiptId, {
        status: 'Warranty',
        refundAmount: (warrantyType !== 'Refund') ? 0 : refundAmount,
        returnReason,
        items: itemsToReturn,
        staffId: currentStaffId,
        warrantyType: warrantyType,
        paymentMethod: (warrantyType === 'Refund') ? paymentMethod : null
      });

      if (res.data?.status === 'success') {
        await fetchOrderDetail();
        setView('detail');
        setActiveTab('warranty');
      } else {
        alert("Lỗi: " + (res.data?.message || "Không thể cập nhật đơn hàng."));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert("Đã xảy ra lỗi hệ thống: " + msg);
    }
  };

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
          <RefreshCw className="animate-spin" size={40} color={PRIMARY_BLUE} style={{ margin: '0 auto 16px' }} />
          <div style={{ fontWeight: '800' }}>Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px' }}>
          <AlertCircle size={48} color={TEXT_RED} style={{ margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px', fontWeight: '900' }}>Lỗi dữ liệu</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>{error}</p>
          <button onClick={onClose} style={{ padding: '12px 32px', borderRadius: '12px', background: '#f1f5f9', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Đóng</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
      <div style={{ background: 'white', width: '680px', borderRadius: '32px', boxShadow: '0 25px 70px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', maxHeight: '95vh', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             {view === 'return' && <button onClick={() => setView('detail')} style={{ border: 'none', background: 'none', padding: '4px', cursor: 'pointer' }}><ArrowLeft size={24} /></button>}
             <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>{view === 'return' ? 'Sửa Hóa Đơn' : `Chi Tiết Hóa Đơn #HD${String(order.receiptId).padStart(6, '0')}`}</h2>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f8fafc', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} color="#94a3b8" />
          </button>
        </div>

        {/* Navigation Tabs (Only in Detail View) */}
        {view === 'detail' && (
          <div style={{ padding: '16px 24px' }}>
            <div style={{ background: '#f1f5f9', padding: '6px', borderRadius: '16px', display: 'flex', gap: '4px' }}>
              <button onClick={() => setActiveTab('detail')} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: activeTab === 'detail' ? 'white' : 'transparent', color: activeTab === 'detail' ? '#0f172a' : '#64748b', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: activeTab === 'detail' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>
                <FileText size={18} /> Chi tiết
              </button>
              <button onClick={() => setActiveTab('warranty')} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: activeTab === 'warranty' ? 'white' : 'transparent', color: activeTab === 'warranty' ? '#0f172a' : '#64748b', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: activeTab === 'warranty' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>
                <ShieldCheck size={18} /> Lịch sử bảo hành
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

          {view === 'return' ? (
            /* RETURN VIEW (MATCHING SCREENSHOT) */
            <div style={{ animation: 'fadeIn 0.2s' }}>
              {/* Customer Info Row */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1, padding: '14px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={18} color={PRIMARY_BLUE} />
                  <span style={{ fontWeight: '800', color: '#1e293b' }}>{order.customerName}</span>
                </div>
                <div style={{ flex: 1, padding: '14px 20px', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #bcf0da', display: 'flex', alignItems: 'center', gap: '12px', color: '#059669' }}>
                  <CheckCircle2 size={18} />
                  <span style={{ fontWeight: '800' }}>Đã thanh toán</span>
                </div>
              </div>

              {/* Table Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <ShoppingBag size={18} color={PRIMARY_BLUE} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900' }}>Danh sách sản phẩm hoàn trả</h3>
              </div>

              <div style={{ border: '1px solid #f1f5f9', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Tên sản phẩm</th>
                      <th style={{ padding: '16px', textAlign: 'center', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>SL Mua</th>
                      <th style={{ padding: '16px', textAlign: 'center', fontWeight: '800', color: TEXT_RED, textTransform: 'uppercase' }}>{processType === 'Warranty' ? 'SL BẢO HÀNH' : 'SL TRẢ'}</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Giá bán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item) => {
                      const warrantyStatus = processType === 'Warranty' ? getWarrantyStatus(order.orderAt, item.warrantyPeriod) : null;
                      const isExpired = warrantyStatus?.expired;
                      return (
                      <tr key={item.variantId} style={{ borderBottom: '1px solid #f8fafc', opacity: isExpired ? 0.6 : 1 }}>
                        <td style={{ padding: '16px', fontWeight: '700', color: '#1e293b' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {item.image ? (
                              <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', background: '#f1f5f9' }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShoppingBag size={20} color="#94a3b8" />
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: '800' }}>{item.productName}</div>
                              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal', marginTop: '2px' }}>{item.variantSKU}</div>
                              {processType === 'Warranty' && (
                                <div style={{ fontSize: '11px', marginTop: '4px', color: isExpired ? TEXT_RED : SUCCESS_GREEN }}>
                                  {warrantyStatus.text}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center', fontWeight: '800', color: '#94a3b8' }}>{item.quantity}</td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <input
                            type="number"
                            disabled={isExpired}
                            value={returnItems[item.variantId] || 0}
                            onChange={(e) => handleReturnQtyChange(item.variantId, e.target.value, item.quantity)}
                            style={{ width: '60px', padding: '8px', borderRadius: '10px', border: `1.5px solid ${returnItems[item.variantId] > 0 ? TEXT_RED : '#e2e8f0'}`, textAlign: 'center', fontWeight: '800', outline: 'none', background: isExpired ? '#f1f5f9' : 'white' }}
                          />
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800', color: SUCCESS_GREEN }}>{formatMoney(item.finalPrice * item.quantity)}</td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Status & Payment Row */}

              {/* Action Config Box */}
              <div style={{ background: '#f0fdf4', border: `1px dashed #10b981`, borderRadius: '24px', padding: '24px', marginBottom: '32px', position: 'relative' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: '#059669', textTransform: 'uppercase' }}>Thông tin bảo hành</h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: warrantyType === 'Refund' ? '1fr 1fr' : '1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#059669', display: 'block', marginBottom: '8px' }}>Hình thức bảo hành</label>
                    <select
                      value={warrantyType}
                      onChange={(e) => setWarrantyType(e.target.value)}
                      style={{ width: '100%', padding: '14px 20px', background: 'white', border: '1px solid #10b981', borderRadius: '16px', fontWeight: '700', color: '#047857', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="Replacement">1 đổi 1 (Cấp lại máy mới)</option>
                      <option value="Refund">Hoàn tiền</option>
                    </select>
                  </div>

                  {warrantyType === 'Refund' && (
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '800', color: '#059669', display: 'block', marginBottom: '8px' }}>Hình thức hoàn tiền</label>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          {paymentMethod === 'Tiền mặt' ? <Wallet size={16} color="#059669" /> : <QrCode size={16} color="#059669" />}
                        </div>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          style={{ width: '100%', padding: '14px 16px 14px 40px', background: 'white', border: '1px solid #10b981', borderRadius: '16px', fontWeight: '700', color: '#047857', outline: 'none', cursor: 'pointer', appearance: 'none' }}
                        >
                          <option value="Tiền mặt">Tiền mặt</option>
                          <option value="Chuyển khoản">Chuyển khoản</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {warrantyType === 'Refund' && (
                  <div style={{ marginBottom: '16px', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px' }}>
                    {paymentMethod === 'Tiền mặt' ? (
                      <>
                        <label style={{ fontSize: '12px', fontWeight: '800', color: TEXT_RED, display: 'block', marginBottom: '8px' }}>Số tiền mặt thực tế hoàn lại cho khách (VNĐ)</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={new Intl.NumberFormat('vi-VN').format(refundAmount)}
                            readOnly
                            style={{ width: '100%', padding: '16px 60px 16px 24px', borderRadius: '16px', border: `2px solid ${BORDER_RED}`, background: '#fff1f2', fontSize: '28px', fontWeight: '900', color: TEXT_RED, outline: 'none', cursor: 'default' }}
                          />
                          <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', fontWeight: '900', color: TEXT_RED }}>đ</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#059669', marginBottom: '12px', textTransform: 'uppercase' }}>Quét mã để hoàn tiền: <span style={{ fontSize: '16px', color: TEXT_RED }}>{formatMoney(refundAmount)}</span></div>
                        {refundAmount > 0 ? (
                          <img
                            src={`https://img.vietqr.io/image/mb-88886666-compact.png?amount=${refundAmount}&addInfo=Hoan tien don hang ${order?.receiptId}`}
                            alt="QR Hoàn tiền"
                            style={{ width: '200px', borderRadius: '16px', border: `2px solid ${BORDER_RED}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          />
                        ) : (
                          <div style={{ padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '16px', color: '#94a3b8' }}>Vui lòng chọn sản phẩm để hoàn tiền</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#059669', display: 'block', marginBottom: '8px' }}>Tình trạng lỗi / Ghi chú bảo hành (Bắt buộc)</label>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Mô tả chi tiết tình trạng lỗi của sản phẩm..."
                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', height: '100px', resize: 'none', fontSize: '14px', fontWeight: '600', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
                <button onClick={() => setView('detail')} style={{ padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '800', cursor: 'pointer' }}>Hủy bỏ</button>
                <button onClick={handleProcessReturn} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: SUCCESS_GREEN, color: 'white', fontWeight: '900', cursor: 'pointer' }}>Xác nhận & Cập nhật đơn hàng</button>
              </div>
            </div>
          ) : activeTab === 'detail' ? (
            /* DETAIL VIEW */
            <div style={{ animation: 'fadeIn 0.2s' }}>
              <div style={{ textAlign: 'center', padding: '24px 0', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: SUCCESS_GREEN }}>
                  <CheckCircle2 size={32} strokeWidth={3} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a' }}>{formatMoney(order.totalPrice)}</div>
                <div style={{ color: SUCCESS_GREEN, fontWeight: '800', fontSize: '14px', marginTop: '4px' }}>ĐÃ THANH TOÁN</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                   <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Thông tin đơn hàng</div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                     <span style={{ color: '#64748b', fontWeight: '600' }}>Thời gian</span>
                     <span style={{ fontWeight: '800' }}>{formatLocalDate(order.orderAt)}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                     <span style={{ color: '#64748b', fontWeight: '600' }}>Thu ngân</span>
                     <span style={{ fontWeight: '800' }}>{order.staffName}</span>
                   </div>
                </div>
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                   <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Thông tin khách hàng</div>
                   <div style={{ fontWeight: '900', color: '#1e293b', fontSize: '15px' }}>{order.customerName}</div>
                   <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Phương thức: {order.paymentMethod}</div>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>Sản phẩm đã mua</h4>
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid #f1f5f9', borderRadius: '16px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#1e293b' }}>{item.productName}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.quantity} x {formatMoney(item.finalPrice)}</div>
                    </div>
                    <div style={{ fontWeight: '900' }}>{formatMoney(item.finalPrice * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => setView('return')} style={{ flex: 1, padding: '16px', borderRadius: '18px', border: `1.5px solid ${PRIMARY_BLUE}`, background: 'white', color: PRIMARY_BLUE, fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} /> Bảo hành sản phẩm
                </button>
                <button onClick={onClose} style={{ padding: '16px 24px', borderRadius: '18px', border: 'none', background: '#f1f5f9', fontWeight: '800', cursor: 'pointer' }}>Đóng</button>
              </div>
            </div>
          ) : (
            /* WARRANTY VIEW */
            <div style={{ animation: 'fadeIn 0.2s', textAlign: 'center', padding: '40px 0' }}>
              {order.warrantyHistory && order.warrantyHistory.length > 0 ? (
                <div style={{ textAlign: 'left' }}>
                  {[...order.warrantyHistory].reverse().map((log, i) => (
                    <div key={i} style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '900', color: '#1e293b', fontSize: '15px' }}>Lần bảo hành #{order.warrantyHistory.length - i}</div>
                          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Mã Hóa Đơn: #{order.receiptId}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>{formatLocalDate(log.createdAt)}</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: log.warrantyType === 'Refund' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
                        <div>
                          <span style={{ color: '#94a3b8', fontWeight: '600' }}>Nhân viên xử lý:</span>
                          <div style={{ fontWeight: '800', color: '#1e293b', marginTop: '2px' }}>{log.staffName}</div>
                        </div>
                        <div>
                          <span style={{ color: '#94a3b8', fontWeight: '600' }}>Khách hàng:</span>
                          <div style={{ fontWeight: '800', color: '#1e293b', marginTop: '2px' }}>{order.customerName}</div>
                        </div>
                        {log.warrantyType === 'Refund' && log.paymentMethod && (
                          <div>
                            <span style={{ color: '#94a3b8', fontWeight: '600' }}>Hình thức nhận tiền:</span>
                            <div style={{ fontWeight: '800', color: '#1e293b', marginTop: '2px', textTransform: 'uppercase' }}>{log.paymentMethod}</div>
                          </div>
                        )}
                      </div>

                      <div style={{ background: 'white', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9', marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={14} /> Sản phẩm bảo hành
                        </div>
                        {log.warrantyItems && log.warrantyItems.length > 0 ? (
                          log.warrantyItems.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', borderBottom: idx < log.warrantyItems.length - 1 ? '1px dashed #f1f5f9' : 'none', paddingBottom: idx < log.warrantyItems.length - 1 ? '6px' : '0' }}>
                              <span style={{ fontWeight: '700', color: '#1e293b' }}>{item.quantity} x {item.productName}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>Không có thông tin sản phẩm</div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f0fdf4', padding: '16px', borderRadius: '16px', border: '1px dashed #10b981' }}>
                        <div style={{ flex: 1, paddingRight: log.warrantyType === 'Refund' ? '16px' : '0' }}>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#059669', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Info size={12} /> TÌNH TRẠNG LỖI ({log.warrantyType === 'Refund' ? 'Hoàn tiền' : '1 đổi 1'})
                          </div>
                          <div style={{ fontSize: '13px', color: '#047857', fontWeight: '600', lineHeight: '1.4' }}>{log.reason || 'Không có ghi chú'}</div>
                        </div>
                        {log.warrantyType === 'Refund' && log.refundAmount > 0 && (
                          <div style={{ textAlign: 'right', borderLeft: '1px dashed #6ee7b7', paddingLeft: '16px', minWidth: '130px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#059669', marginBottom: '6px' }}>SỐ TIỀN HOÀN</div>
                            <div style={{ fontSize: '17px', fontWeight: '900', color: '#059669' }}>{formatMoney(log.refundAmount)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ animation: 'fadeIn 0.2s' }}>
                  <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#059669' }}>
                    <ShieldCheck size={40} />
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '900', color: '#1e293b' }}>Lịch sử bảo hành</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>Nhật ký các lần bảo hành sản phẩm</p>

                  <div style={{ padding: '40px', border: '2px dashed #e2e8f0', borderRadius: '24px', color: '#94a3b8', fontWeight: '800' }}>
                    Chưa có lịch sử bảo hành cho đơn này
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default OrderDetailModal;
