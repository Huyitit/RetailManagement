import React, { useState, useEffect } from 'react';
import {
  Search, Calendar, FileText, CheckCircle2, Clock, XCircle, ShieldCheck
} from 'lucide-react';
import OrderDetailModal from '../components/OrderDetailModal';
import { getOrders, getOrderStats } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    today: { count: 0, total: 0 },
    week: { count: 0, total: 0 },
    cancelled: { count: 0, total: 0 }
  });
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
        const fmt = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        params.startDate = `${fmt(first)} 00:00:00`;
        params.endDate = `${fmt(last)} 23:59:59`;
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
      console.error('Fetch data failed', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [search, filter, page]);

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  const renderStatusBadge = (status) => {
    if (status === 'Completed') {
      return (
        <span className="tag tag-success">
          <CheckCircle2 size={12} /> Đã T.toán
        </span>
      );
    }
    if (status === 'Cancelled') {
      return (
        <span className="tag tag-danger">
          <XCircle size={12} /> Đã huỷ
        </span>
      );
    }
    if (status === 'Warranty') {
      return (
        <span className="tag tag-primary">
          <ShieldCheck size={12} /> Bảo hành
        </span>
      );
    }
    return (
      <span className="tag tag-neutral">
        <Clock size={12} /> {status || 'N/A'}
      </span>
    );
  };

  const filterButton = (key, label) => (
    <button
      type="button"
      onClick={() => { setFilter(key); setPage(1); }}
      style={{
        padding: '10px 22px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${filter === key ? 'var(--primary)' : 'var(--border-strong)'}`,
        background: filter === key ? 'var(--primary)' : 'var(--surface)',
        color: filter === key ? 'white' : 'var(--text-muted)',
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: '13px',
        boxShadow: filter === key ? 'var(--shadow-primary)' : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </button>
  );

  const summaryCard = (label, value, accent, accentLabel, Icon, accentBg, accentColor) => (
    <div className="surface-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', margin: '8px 0' }}>
          {value}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: accentColor }}>
          {accentLabel} {accent}
        </div>
      </div>
      <div
        style={{
          width: '48px',
          height: '48px',
          background: accentBg,
          borderRadius: 'var(--radius-md)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor
        }}
      >
        <Icon size={22} />
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Danh sách hóa đơn</h1>
          <p className="page-subtitle">Quản lý đơn bán hàng, trạng thái thanh toán</p>
        </div>
      </header>

      <div className="page-body custom-scrollbar">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          {summaryCard('Đơn hôm nay', stats?.today?.count || 0, formatMoney(stats?.today?.total || 0), '+',
            FileText, 'var(--primary-light)', 'var(--primary)')}
          {summaryCard('Đơn tuần này', stats?.week?.count || 0, formatMoney(stats?.week?.total || 0), '+',
            Calendar, 'var(--primary-light)', 'var(--primary)')}
          {summaryCard('Đã huỷ / Hoàn tiền', stats?.cancelled?.count || 0, formatMoney(stats?.cancelled?.total || 0), '−',
            XCircle, 'var(--danger-bg)', 'var(--danger)')}
        </div>

        <div className="surface-card-flush">
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {filterButton('all', 'Tất cả')}
              {filterButton('today', 'Hôm nay')}
              {filterButton('week', 'Tuần này')}
              <div style={{ position: 'relative' }}>
                <Calendar
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      setCustomDateRange({
                        start: `${e.target.value} 00:00:00`,
                        end: `${e.target.value} 23:59:59`
                      });
                      setFilter('custom');
                      setPage(1);
                    }
                  }}
                  className="input-pill"
                  style={{ paddingLeft: '36px', width: '170px', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ position: 'relative', width: '300px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
              <input
                type="text"
                placeholder="Tìm theo mã HĐ, tên Khách hàng..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-pill"
                style={{ paddingLeft: '44px', background: 'var(--page-bg)' }}
              />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--page-bg)', borderBottom: '1px solid var(--border-light)' }}>
                {['Mã HĐ', 'Khách hàng', 'Thu ngân', 'Ngày tạo', 'Thanh toán', 'Trạng thái', 'Tổng tiền'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: '14px 24px',
                      textAlign: i === 6 ? 'right' : 'left',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px'
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-light)', fontWeight: 600 }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-light)', fontWeight: 600 }}>
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : orders.map((order, idx) => (
                <tr
                  key={idx}
                  onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                  className="table-row-hover"
                  style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}
                >
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={16} color="var(--text-light)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        HD{String(order.receiptId).padStart(6, '0')}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {order.customerName}
                  </td>
                  <td style={{ padding: '18px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {order.staffName || 'N/A'}
                  </td>
                  <td style={{ padding: '18px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {new Date(order.orderAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} •{' '}
                    {new Date(order.orderAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: '18px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {order.paymentMethod}
                  </td>
                  <td style={{ padding: '18px 24px' }}>{renderStatusBadge(order.saleStatus)}</td>
                  <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                    {order.saleStatus === 'Warranty' && parseFloat(order.refundAmount || 0) > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '15px' }}>
                          {formatMoney(order.netTotal)}
                        </div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: 'var(--danger)',
                            fontSize: '11px',
                            textDecoration: 'line-through',
                            marginTop: '2px'
                          }}
                        >
                          {formatMoney(order.totalPrice)}
                        </div>
                      </div>
                    ) : order.saleStatus === 'Cancelled' ? (
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--danger)',
                          fontSize: '15px',
                          textDecoration: 'line-through',
                          opacity: 0.7
                        }}
                      >
                        {formatMoney(order.totalPrice)}
                      </div>
                    ) : (
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '15px' }}>
                        {formatMoney(order.netTotal || order.totalPrice)}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div
              style={{
                padding: '20px 24px',
                borderTop: '1px solid var(--border-light)',
                background: 'var(--page-bg)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface)',
                  color: page === 1 ? 'var(--text-light)' : 'var(--text-main)',
                  fontWeight: 700,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '13px'
                }}
              >
                Trước
              </button>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                Trang <span style={{ color: 'var(--text-main)' }}>{page}</span> / {totalPages}
              </div>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface)',
                  color: page === totalPages ? 'var(--text-light)' : 'var(--text-main)',
                  fontWeight: 700,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '13px'
                }}
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
    </div>
  );
};

export default Orders;
