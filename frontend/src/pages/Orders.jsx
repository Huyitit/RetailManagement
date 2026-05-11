import React, { useState, useEffect } from 'react';
import {
  Search, Calendar, FileText, ChevronRight,
  CheckCircle2, Clock, XCircle, AlertCircle,
  Printer, ArrowLeftRight, Download, Filter, ShieldCheck
} from 'lucide-react';
import OrderDetailModal from '../components/OrderDetailModal';
import { getOrders, getOrderStats } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ today: { count: 0, total: 0 }, week: { count: 0, total: 0 }, cancelled: { count: 0, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchData = async () => {
    try {
      const params = { search, page, limit: 20 };
      if (filter === 'today') {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        params.startDate = `${y}-${m}-${d} 00:00:00`;
        params.endDate = `${y}-${m}-${d} 23:59:59`;
      } else if (filter === 'week') {
        const now = new Date();
        const first = new Date(now.setDate(now.getDate() - now.getDay()));
        const last = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        const formatDate = (date) => {
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const d = String(date.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}`;
        };
        params.startDate = `${formatDate(first)} 00:00:00`;
        params.endDate = `${formatDate(last)} 23:59:59`;
      } else if (filter === 'custom' && customDateRange.start) {
        params.startDate = customDateRange.start;
        params.endDate = customDateRange.end;
      }

      const ordersRes = await getOrders(params);
      const statsRes = await getOrderStats();

      if (ordersRes.data?.status === 'success') {
        setOrders(ordersRes.data.data || []);
        if (ordersRes.data.pagination) {
          setTotalPages(ordersRes.data.pagination.totalPages);
        }
      }

      if (statsRes.data?.status === 'success') {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error("Fetch data failed", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [search, filter, page]);

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span style={{ background: '#ecfdf5', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Đã T.Toán</span>;
      case 'Cancelled':
        return <span style={{ background: '#fef2f2', color: '#ef4444', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Đã Hủy</span>;
      case 'Warranty':
        return <span style={{ background: '#eef2ff', color: '#6366f1', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} /> Bảo hành</span>;
      default:
        return <span style={{ background: '#f1f5f9', color: '#64748b', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {status}</span>;
    }
  };

  return (
    <>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ padding: '32px 40px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Danh sách hóa đơn</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>Quản lý đơn bán hàng, trạng thái thanh toán</p>
        </header>

        {/* Stats & Filters */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Đơn hôm nay</div>
                <div style={{ fontSize: '32px', fontWeight: '950', color: '#0f172a', margin: '8px 0' }}>{stats?.today?.count || 0}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>+ {formatMoney(stats?.today?.total || 0)}</div>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <FileText size={24} />
              </div>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Đơn tuần này</div>
                <div style={{ fontSize: '32px', fontWeight: '950', color: '#0f172a', margin: '8px 0' }}>{stats?.week?.count || 0}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>+ {formatMoney(stats?.week?.total || 0)}</div>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#f5f3ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                <Calendar size={24} />
              </div>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Đã hủy / Hoàn tiền</div>
                <div style={{ fontSize: '32px', fontWeight: '950', color: '#0f172a', margin: '8px 0' }}>{stats?.cancelled?.count || 0}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444' }}>- {formatMoney(stats?.cancelled?.total || 0)}</div>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#fff1f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
                <XCircle size={24} />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setFilter('all'); setPage(1); }} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: filter === 'all' ? '#10b981' : '#f1f5f9', color: filter === 'all' ? 'white' : '#64748b', fontWeight: '800', cursor: 'pointer' }}>Tất cả</button>
                <button onClick={() => { setFilter('today'); setPage(1); }} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: filter === 'today' ? '#10b981' : '#f1f5f9', color: filter === 'today' ? 'white' : '#64748b', fontWeight: '800', cursor: 'pointer' }}>Hôm nay</button>
                <button onClick={() => { setFilter('week'); setPage(1); }} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: filter === 'week' ? '#10b981' : '#f1f5f9', color: filter === 'week' ? 'white' : '#64748b', fontWeight: '800', cursor: 'pointer' }}>Tuần này</button>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="date"
                    onChange={(e) => {
                      if (e.target.value) {
                        const selected = e.target.value;
                        setCustomDateRange({ start: `${selected} 00:00:00`, end: `${selected} 23:59:59` });
                        setFilter('custom');
                        setPage(1);
                      }
                    }}
                    style={{ padding: '10px 12px 10px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', width: '160px', color: '#1e293b', fontWeight: '600' }}
                  />
                </div>
              </div>

              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Tìm theo mã HĐ, tên Khách hàng..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: '600' }}
                />
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Mã HĐ</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Khách hàng</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Ngày tạo</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Thanh toán</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Trạng thái</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: '600' }}>Đang tải dữ liệu...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: '600' }}>Không tìm thấy đơn hàng nào</td></tr>
                ) : orders.map((order, idx) => (
                  <tr
                    key={idx}
                    onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FileText size={18} color="#94a3b8" />
                        <span style={{ fontWeight: '800', color: '#0f172a' }}>{`HD${String(order.receiptId).padStart(6, '0')}`}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', fontWeight: '700', color: '#1e293b' }}>{order.customerName}</td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                      {new Date(order.orderAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(order.orderAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: '#64748b', fontWeight: '700' }}>{order.paymentMethod}</td>
                    <td style={{ padding: '20px 24px' }}>{getStatusBadge(order.saleStatus)}</td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      {(order.saleStatus === 'Warranty' && parseFloat(order.refundAmount || 0) > 0) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <div style={{ fontWeight: '900', color: '#0f172a', fontSize: '15px' }}>{formatMoney(Number(order.totalPrice) - Number(order.refundAmount || 0))}</div>
                          <div style={{ fontWeight: '600', color: '#ef4444', fontSize: '11px', textDecoration: 'line-through', marginTop: '2px' }}>{formatMoney(order.totalPrice)}</div>
                        </div>
                      ) : (order.saleStatus === 'Cancelled') ? (
                        <div style={{ fontWeight: '600', color: '#ef4444', fontSize: '15px', textDecoration: 'line-through', opacity: 0.7 }}>{formatMoney(order.totalPrice)}</div>
                      ) : (
                        <div style={{ fontWeight: '900', color: '#0f172a', fontSize: '15px' }}>{formatMoney(order.totalPrice)}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: page === 1 ? '#cbd5e1' : '#1e293b', fontWeight: '700', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                >
                  Trước
                </button>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#64748b' }}>
                  Trang <span style={{ color: '#0f172a' }}>{page}</span> / {totalPages}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: page === totalPages ? '#cbd5e1' : '#1e293b', fontWeight: '700', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>

        {showDetailModal && selectedOrder && (
          <OrderDetailModal
            receiptId={selectedOrder.receiptId}
            onClose={() => { setShowDetailModal(false); fetchData(); }}
          />
        )}

        <style>{`
          .table-row-hover:hover {
            background: #f8fafc;
          }
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
    </>
  );
};

export default Orders;
