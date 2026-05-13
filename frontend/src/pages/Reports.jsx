import React, { useState, useEffect } from 'react';
import { getRevenueReport, getRevenueByDate, getInventoryReport, getDebtReport, getDebtDetail } from '../services/api';
import OrdersTable from '../components/OrdersTable';
import StatCard from '../components/StatCard';
import OrderDetailModalShell from '../components/OrderDetailModalShell';
import { BarChart3, TrendingUp, AlertTriangle, Wallet, ArrowDownRight, PackageOpen } from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [isLoading, setIsLoading] = useState(true);

  const [revenueData, setRevenueData] = useState({ summary: {}, daily: [] });
  const [inventoryData, setInventoryData] = useState({ summary: {}, items: [] });
  const [debtData, setDebtData] = useState([]);
  const [revenueDetailOpen, setRevenueDetailOpen] = useState(false);
  const [revenueDetailDate, setRevenueDetailDate] = useState('');
  const [revenueDetailOrders, setRevenueDetailOrders] = useState([]);
  const [revenueDetailLoading, setRevenueDetailLoading] = useState(false);
  const [revenueDetailError, setRevenueDetailError] = useState('');
  const [debtDetailOpen, setDebtDetailOpen] = useState(false);
  const [debtDetailSupplier, setDebtDetailSupplier] = useState(null);
  const [debtDetailReceipts, setDebtDetailReceipts] = useState([]);
  const [debtDetailLoading, setDebtDetailLoading] = useState(false);
  const [debtDetailError, setDebtDetailError] = useState('');

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [inventoryFilter, setInventoryFilter] = useState('low_stock');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'revenue') {
        const res = await getRevenueReport({ startDate: dateRange.start, endDate: dateRange.end });
        if (res.data?.status === 'success') setRevenueData(res.data.data);
      } else if (activeTab === 'inventory') {
        const res = await getInventoryReport({ filter: inventoryFilter });
        if (res.data?.status === 'success') setInventoryData(res.data.data);
      } else if (activeTab === 'debt') {
        const res = await getDebtReport();
        if (res.data?.status === 'success') setDebtData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab, dateRange, inventoryFilter]);

  const openRevenueDetail = async (row) => {
    if (!row?.date) return;
    setRevenueDetailDate(row.date);
    setRevenueDetailOpen(true);
    setRevenueDetailLoading(true);
    setRevenueDetailError('');
    try {
      const res = await getRevenueByDate(row.date);
      if (res.data?.status === 'success') {
        setRevenueDetailOrders(res.data.data || []);
      } else {
        setRevenueDetailOrders([]);
        setRevenueDetailError('Không thể tải chi tiết doanh thu.');
      }
    } catch (err) {
      console.error('Failed to fetch revenue detail:', err);
      setRevenueDetailOrders([]);
      setRevenueDetailError('Không thể tải chi tiết doanh thu.');
    } finally {
      setRevenueDetailLoading(false);
    }
  };

  const openDebtDetail = async (row) => {
    if (!row?.supplierId) return;
    setDebtDetailSupplier(row);
    setDebtDetailOpen(true);
    setDebtDetailLoading(true);
    setDebtDetailError('');
    try {
      const res = await getDebtDetail(row.supplierId);
      if (res.data?.status === 'success') {
        setDebtDetailReceipts(res.data.data?.receipts || []);
      } else {
        setDebtDetailReceipts([]);
        setDebtDetailError('Không thể tải chi tiết công nợ.');
      }
    } catch (err) {
      console.error('Failed to fetch debt detail:', err);
      setDebtDetailReceipts([]);
      setDebtDetailError('Không thể tải chi tiết công nợ.');
    } finally {
      setDebtDetailLoading(false);
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  const tabStyle = (active) => ({
    padding: '10px 22px',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${active ? 'var(--primary)' : 'var(--border-strong)'}`,
    background: active ? 'var(--primary)' : 'var(--surface)',
    color: active ? 'white' : 'var(--text-muted)',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: active ? 'var(--shadow-primary)' : 'none',
    transition: 'all 0.2s ease'
  });

  const revenueColumns = [
    {
      header: 'Ngày', accessor: 'date', render: (row) => (
        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
          {new Date(row.date).toLocaleDateString('vi-VN')}
        </div>
      )
    },
    {
      header: 'Số lượng đơn', accessor: 'orderCount', align: 'center', render: (row) => (
        <span className="tag tag-neutral">{row.orderCount}</span>
      )
    },
    {
      header: 'Doanh thu', accessor: 'revenue', align: 'right', render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatMoney(row.revenue)}</span>
      )
    },
    {
      header: 'Hoàn tiền', accessor: 'refund', align: 'right', render: (row) => (
        <span style={{ color: 'var(--danger)' }}>{formatMoney(row.refund)}</span>
      )
    }
  ];

  const inventoryColumns = [
    {
      header: 'Mã SKU', accessor: 'skuCode', render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.skuCode}</span>
      )
    },
    {
      header: 'Sản phẩm', accessor: 'productName', render: (row) => (
        <span style={{ fontSize: '13px', color: 'var(--text-main)' }}>{row.productName || 'N/A'}</span>
      )
    },
    {
      header: 'Tồn kho hiện tại', accessor: 'stockQuantity', align: 'center', render: (row) => (
        <span className={`tag tag-${row.stockQuantity <= row.minStock ? 'danger' : 'warning'}`}>
          {row.stockQuantity}
        </span>
      )
    },
    {
      header: 'Giá bán', accessor: 'sellPrice', align: 'right', render: (row) => (
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatMoney(row.sellPrice)}</span>
      )
    }
  ];

  const debtColumns = [
    {
      header: 'Nhà cung cấp', accessor: 'companyName', render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.companyName}</span>
      )
    },
    {
      header: 'Tổng nhập', accessor: 'totalImported', align: 'right', render: (row) => (
        <span style={{ color: 'var(--text-main)' }}>{formatMoney(row.totalImported)}</span>
      )
    },
    {
      header: 'Đã thanh toán', accessor: 'totalPaid', align: 'right', render: (row) => (
        <span style={{ color: 'var(--success)' }}>{formatMoney(row.totalPaid)}</span>
      )
    },
    {
      header: 'Còn nợ', accessor: 'totalDebt', align: 'right', render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--danger)' }}>{formatMoney(row.totalDebt)}</span>
      )
    }
  ];

  const revenueDetailColumns = [
    { header: 'Mã đơn', accessor: 'orderId', render: (row) => <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.orderId}</span> },
    { header: 'Khách hàng', accessor: 'customerName', render: (row) => <span>{row.customerName || 'Khách lẻ'}</span> },
    { header: 'Thời gian', accessor: 'createdAt', render: (row) => <span>{new Date(row.createdAt).toLocaleString('vi-VN')}</span> },
    { header: 'Thanh toán', accessor: 'paymentMethod', render: (row) => <span>{row.paymentMethod || 'N/A'}</span> },
    {
      header: 'Số SP', accessor: 'itemCount', align: 'center', render: (row) => (
        <span className="tag tag-neutral">{row.itemCount}</span>
      )
    },
    { header: 'Tổng tiền', accessor: 'finalTotal', align: 'right', render: (row) => <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatMoney(row.finalTotal)}</span> },
    { header: 'Hoàn tiền', accessor: 'refundAmount', align: 'right', render: (row) => <span style={{ color: 'var(--danger)' }}>{formatMoney(row.refundAmount)}</span> }
  ];

  const debtDetailColumns = [
    { header: 'Mã phiếu', accessor: 'receiptId', render: (row) => <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.receiptId}</span> },
    { header: 'Ngày nhập', accessor: 'importDate', render: (row) => <span>{new Date(row.importDate).toLocaleDateString('vi-VN')}</span> },
    {
      header: 'Số dòng', accessor: 'items', align: 'center', render: (row) => (
        <span className="tag tag-neutral">{row.items?.length || 0}</span>
      )
    },
    { header: 'Tổng tiền', accessor: 'totalAmount', align: 'right', render: (row) => <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatMoney(row.totalAmount)}</span> },
    { header: 'Ghi chú', accessor: 'note', render: (row) => <span>{row.note || 'N/A'}</span> }
  ];

  const filterCard = (titleNode, controls) => (
    <div
      className="surface-card"
      style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
    >
      <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {titleNode}
      </div>
      <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>{controls}</div>
    </div>
  );

  const sectionPanel = (title, body) => (
    <div className="surface-card-flush">
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          fontWeight: 600,
          color: 'var(--text-main)'
        }}
      >
        {title}
      </div>
      <div style={{ padding: '20px 24px' }}>{body}</div>
    </div>
  );

  const errorBanner = (text) => (
    <div
      style={{
        marginBottom: '14px',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--danger-bg)',
        color: 'var(--danger)',
        fontSize: '13px',
        fontWeight: 700
      }}
    >
      {text}
    </div>
  );

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Báo cáo & Thống kê</h1>
          <p className="page-subtitle">Theo dõi hiệu suất kinh doanh, tồn kho và công nợ</p>
        </div>
      </header>

      <div className="page-body custom-scrollbar">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button type="button" onClick={() => setActiveTab('revenue')} style={tabStyle(activeTab === 'revenue')}>
            <BarChart3 size={18} /> Doanh thu bán hàng
          </button>
          <button type="button" onClick={() => setActiveTab('inventory')} style={tabStyle(activeTab === 'inventory')}>
            <AlertTriangle size={18} /> Cảnh báo tồn kho
          </button>
          <button type="button" onClick={() => setActiveTab('debt')} style={tabStyle(activeTab === 'debt')}>
            <Wallet size={18} /> Công nợ nhà cung cấp
          </button>
        </div>

        {activeTab === 'revenue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filterCard(
              <><BarChart3 size={18} /> Tổng quan doanh thu</>,
              <>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="input-pill"
                  style={{ width: '160px', fontSize: '13px', padding: '10px 12px' }}
                />
                <span style={{ color: 'var(--text-light)', fontWeight: 700 }}>đến</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="input-pill"
                  style={{ width: '160px', fontSize: '13px', padding: '10px 12px' }}
                />
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <StatCard title="Tổng doanh thu" value={formatMoney(revenueData.summary?.totalRevenue)} icon={<TrendingUp size={22} />} />
              <StatCard title="Số đơn hoàn thành" value={revenueData.summary?.totalOrders || 0} icon={<PackageOpen size={22} />} />
              <StatCard title="Doanh thu thuần" value={formatMoney(revenueData.summary?.netRevenue)} icon={<BarChart3 size={22} />} />
              <StatCard title="Thuế" value={formatMoney(revenueData.summary?.totalTax)} icon={<BarChart3 size={22} />} />
              <StatCard title="Chiết khấu" value={formatMoney(revenueData.summary?.totalDiscount)} icon={<ArrowDownRight size={22} />} />
              <StatCard title="Hoàn tiền" value={formatMoney(revenueData.summary?.totalRefund)} icon={<ArrowDownRight size={22} />} />
            </div>

            {sectionPanel(
              'Chi tiết theo ngày',
              <OrdersTable
                columns={revenueColumns}
                data={revenueData.daily}
                isLoading={isLoading}
                onRowDoubleClick={openRevenueDetail}
              />
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filterCard(
              <><AlertTriangle size={18} /> Bộ lọc tồn kho</>,
              <select
                value={inventoryFilter}
                onChange={(e) => setInventoryFilter(e.target.value)}
                className="input-pill"
                style={{ width: '220px', padding: '10px 12px', fontSize: '13px' }}
              >
                <option value="all">Tất cả</option>
                <option value="low_stock">Sắp hết hàng</option>
                <option value="long_standing">Tồn kho lâu ngày</option>
              </select>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <StatCard
                title="Sản phẩm sắp hết hàng"
                value={inventoryData.summary?.lowStockCount || 0}
                subtitle="Tồn kho dưới mức tối thiểu"
                icon={<AlertTriangle size={22} />}
              />
              <StatCard
                title="Hết hàng"
                value={inventoryData.summary?.outOfStockCount || 0}
                subtitle="Sản phẩm đã hết hàng"
                icon={<PackageOpen size={22} />}
              />
            </div>

            {sectionPanel(
              'Danh sách hàng cần nhập thêm',
              <OrdersTable
                columns={inventoryColumns}
                data={inventoryData.items}
                isLoading={isLoading}
                emptyMessage="Kho đang ở trạng thái an toàn, không có sản phẩm sắp hết."
              />
            )}
          </div>
        )}

        {activeTab === 'debt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <StatCard
                title="Tổng công nợ cần trả"
                value={formatMoney(debtData.reduce((sum, d) => sum + Number(d.totalDebt || 0), 0))}
                subtitle="Tiền hàng chưa thanh toán cho NCC"
                icon={<ArrowDownRight size={22} />}
              />
            </div>

            {sectionPanel(
              'Chi tiết công nợ theo nhà cung cấp',
              <OrdersTable
                columns={debtColumns}
                data={debtData}
                isLoading={isLoading}
                emptyMessage="Không có khoản nợ nào được ghi nhận."
                onRowClick={openDebtDetail}
              />
            )}
          </div>
        )}
      </div>

      <OrderDetailModalShell
        isOpen={revenueDetailOpen}
        onClose={() => setRevenueDetailOpen(false)}
        title={`Chi tiết doanh thu ngày ${revenueDetailDate ? new Date(revenueDetailDate).toLocaleDateString('vi-VN') : ''}`}
        size="xl"
      >
        {revenueDetailError && errorBanner(revenueDetailError)}
        <OrdersTable
          columns={revenueDetailColumns}
          data={revenueDetailOrders}
          isLoading={revenueDetailLoading}
          emptyMessage="Không có đơn hàng nào trong ngày này."
        />
      </OrderDetailModalShell>

      <OrderDetailModalShell
        isOpen={debtDetailOpen}
        onClose={() => setDebtDetailOpen(false)}
        title={`Chi tiết công nợ - ${debtDetailSupplier?.companyName || ''}`}
        size="xl"
      >
        {debtDetailError && errorBanner(debtDetailError)}
        <OrdersTable
          columns={debtDetailColumns}
          data={debtDetailReceipts}
          isLoading={debtDetailLoading}
          emptyMessage="Không có phiếu nhập nào cho nhà cung cấp này."
        />
      </OrderDetailModalShell>
    </div>
  );
};

export default Reports;
