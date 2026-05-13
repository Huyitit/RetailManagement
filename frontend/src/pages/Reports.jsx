import React, { useState, useEffect } from 'react';
import { getRevenueReport, getRevenueByDate, getInventoryReport, getDebtReport, getDebtDetail } from '../services/api';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import OrderDetailModalShell from '../components/OrderDetailModalShell';
import { BarChart3, TrendingUp, AlertTriangle, Wallet, ArrowDownRight, PackageOpen } from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('revenue'); // revenue, inventory, debt
  const [isLoading, setIsLoading] = useState(true);
  
  // States
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
  
  // Filters
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // 1st of month
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

  useEffect(() => {
    fetchData();
  }, [activeTab, dateRange, inventoryFilter]);

  const openRevenueDetail = async (row) => {
    const date = row?.date;
    if (!date) return;
    setRevenueDetailDate(date);
    setRevenueDetailOpen(true);
    setRevenueDetailLoading(true);
    setRevenueDetailError('');
    try {
      const res = await getRevenueByDate(date);
      if (res.data?.status === 'success') {
        setRevenueDetailOrders(res.data.data || []);
      } else {
        setRevenueDetailOrders([]);
        setRevenueDetailError('Khong the tai chi tiet doanh thu.');
      }
    } catch (err) {
      console.error('Failed to fetch revenue detail:', err);
      setRevenueDetailOrders([]);
      setRevenueDetailError('Khong the tai chi tiet doanh thu.');
    } finally {
      setRevenueDetailLoading(false);
    }
  };

  const openDebtDetail = async (row) => {
    const supplierId = row?.supplierId;
    if (!supplierId) return;
    setDebtDetailSupplier(row);
    setDebtDetailOpen(true);
    setDebtDetailLoading(true);
    setDebtDetailError('');
    try {
      const res = await getDebtDetail(supplierId);
      if (res.data?.status === 'success') {
        setDebtDetailReceipts(res.data.data?.receipts || []);
      } else {
        setDebtDetailReceipts([]);
        setDebtDetailError('Khong the tai chi tiet cong no.');
      }
    } catch (err) {
      console.error('Failed to fetch debt detail:', err);
      setDebtDetailReceipts([]);
      setDebtDetailError('Khong the tai chi tiet cong no.');
    } finally {
      setDebtDetailLoading(false);
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  // --- Revenue Renderers ---
  const revenueColumns = [
    { header: 'Ngày', accessor: 'date', render: (row) => <div className="font-bold">{new Date(row.date).toLocaleDateString('vi-VN')}</div> },
    { header: 'Số lượng đơn', accessor: 'orderCount', align: 'center', render: (row) => <span className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold">{row.orderCount}</span> },
    { header: 'Doanh thu', accessor: 'revenue', align: 'right', render: (row) => <span className="font-bold text-indigo-700">{formatMoney(row.revenue)}</span> },
    { header: 'Hoan tien', accessor: 'refund', align: 'right', render: (row) => <span className="text-rose-600">{formatMoney(row.refund)}</span> }
  ];

  // --- Inventory Renderers ---
  const inventoryColumns = [
    { header: 'Mã SKU', accessor: 'skuCode', render: (row) => <span className="font-bold text-slate-800">{row.skuCode}</span> },
    { header: 'Sản phẩm', accessor: 'productName', render: (row) => <span className="text-sm">{row.productName || 'N/A'}</span> },
    { header: 'Tồn kho hiện tại', accessor: 'stockQuantity', align: 'center', render: (row) => (
      <span className={`px-2 py-1 rounded-md text-xs font-bold ${row.stockQuantity <= row.minStock ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
        {row.stockQuantity}
      </span>
    )},
    { header: 'Gia ban', accessor: 'sellPrice', align: 'right', render: (row) => <span>{formatMoney(row.sellPrice)}</span> }
  ];

  // --- Debt Renderers ---
  const debtColumns = [
    { header: 'Nha cung cap', accessor: 'companyName', render: (row) => <span className="font-bold text-slate-800">{row.companyName}</span> },
    { header: 'Tong nhap', accessor: 'totalImported', align: 'right', render: (row) => <span>{formatMoney(row.totalImported)}</span> },
    { header: 'Da thanh toan', accessor: 'totalPaid', align: 'right', render: (row) => <span className="text-emerald-600">{formatMoney(row.totalPaid)}</span> },
    { header: 'Con no', accessor: 'totalDebt', align: 'right', render: (row) => <span className="font-bold text-rose-600">{formatMoney(row.totalDebt)}</span> }
  ];

  const revenueDetailColumns = [
    { header: 'Ma don', accessor: 'orderId', render: (row) => <span className="font-bold text-slate-800">{row.orderId}</span> },
    { header: 'Khach hang', accessor: 'customerName', render: (row) => <span>{row.customerName || 'Khach le'}</span> },
    { header: 'Thoi gian', accessor: 'createdAt', render: (row) => <span>{new Date(row.createdAt).toLocaleString('vi-VN')}</span> },
    { header: 'Thanh toan', accessor: 'paymentMethod', render: (row) => <span>{row.paymentMethod || 'N/A'}</span> },
    { header: 'So sp', accessor: 'itemCount', align: 'center', render: (row) => <span className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold">{row.itemCount}</span> },
    { header: 'Tong tien', accessor: 'finalTotal', align: 'right', render: (row) => <span className="font-bold text-indigo-700">{formatMoney(row.finalTotal)}</span> },
    { header: 'Hoan tien', accessor: 'refundAmount', align: 'right', render: (row) => <span className="text-rose-600">{formatMoney(row.refundAmount)}</span> }
  ];

  const debtDetailColumns = [
    { header: 'Ma phieu', accessor: 'receiptId', render: (row) => <span className="font-bold text-slate-800">{row.receiptId}</span> },
    { header: 'Ngay nhap', accessor: 'importDate', render: (row) => <span>{new Date(row.importDate).toLocaleDateString('vi-VN')}</span> },
    { header: 'So dong', accessor: 'items', align: 'center', render: (row) => <span className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold">{row.items?.length || 0}</span> },
    { header: 'Tong tien', accessor: 'totalAmount', align: 'right', render: (row) => <span className="font-bold text-indigo-700">{formatMoney(row.totalAmount)}</span> },
    { header: 'Ghi chu', accessor: 'note', render: (row) => <span>{row.note || 'N/A'}</span> }
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      <header style={{ padding: '32px 40px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Báo cáo & Thống kê</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>Theo dõi hiệu suất kinh doanh, tồn kho và công nợ</p>
        </div>
      </header>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('revenue')}
            style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'revenue' ? '#10b981' : '#f1f5f9', color: activeTab === 'revenue' ? 'white' : '#64748b', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <BarChart3 size={18}/> Doanh thu ban hang
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'inventory' ? '#10b981' : '#f1f5f9', color: activeTab === 'inventory' ? 'white' : '#64748b', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <AlertTriangle size={18}/> Canh bao ton kho
          </button>
          <button
            onClick={() => setActiveTab('debt')}
            style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'debt' ? '#10b981' : '#f1f5f9', color: activeTab === 'debt' ? 'white' : '#64748b', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Wallet size={18}/> Cong no nha cung cap
          </button>
        </div>

        {/* Content based on Tab */}
        {activeTab === 'revenue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} /> Tong quan doanh thu
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                  style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', width: '150px', color: '#1e293b', fontWeight: '600' }}
                />
                <span style={{ color: '#94a3b8', fontWeight: '700' }}>den</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                  style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', width: '150px', color: '#1e293b', fontWeight: '600' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <StatCard title="Tong doanh thu" value={formatMoney(revenueData.summary?.totalRevenue)} icon={<TrendingUp size={24}/>} />
              <StatCard title="So don hoan thanh" value={revenueData.summary?.totalOrders || 0} icon={<PackageOpen size={24}/>} />
              <StatCard title="Doanh thu thuan" value={formatMoney(revenueData.summary?.netRevenue)} icon={<BarChart3 size={24}/>} />
              <StatCard title="Thue" value={formatMoney(revenueData.summary?.totalTax)} icon={<BarChart3 size={24}/>} />
              <StatCard title="Chiet khau" value={formatMoney(revenueData.summary?.totalDiscount)} icon={<ArrowDownRight size={24}/>} />
              <StatCard title="Hoan tien" value={formatMoney(revenueData.summary?.totalRefund)} icon={<ArrowDownRight size={24}/>} />
            </div>

            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', fontWeight: '800', color: '#0f172a' }}>Chi tiet theo ngay</div>
              <div style={{ padding: '24px' }}>
                <DataTable columns={revenueColumns} data={revenueData.daily} isLoading={isLoading} onRowDoubleClick={openRevenueDetail} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> Bo loc ton kho
              </div>
              <select
                value={inventoryFilter}
                onChange={(e) => setInventoryFilter(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', color: '#1e293b', fontWeight: '600' }}
              >
                <option value="all">Tat ca</option>
                <option value="low_stock">Sap het hang</option>
                <option value="long_standing">Ton kho lau ngay</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <StatCard title="San pham sap het hang" value={inventoryData.summary?.lowStockCount || 0} subtitle="Ton kho duoi muc toi thieu" icon={<AlertTriangle size={24}/>} />
              <StatCard title="Het hang" value={inventoryData.summary?.outOfStockCount || 0} subtitle="San pham da het hang" icon={<PackageOpen size={24}/>} />
            </div>
            
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', fontWeight: '800', color: '#0f172a' }}>Danh sach hang can nhap them</div>
              <div style={{ padding: '24px' }}>
                <DataTable columns={inventoryColumns} data={inventoryData.items} isLoading={isLoading} emptyMessage="Kho dang o trang thai an toan, khong co san pham sap het." />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'debt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <StatCard title="Tong cong no can tra" value={formatMoney(debtData.reduce((sum, d) => sum + Number(d.totalDebt || 0), 0))} subtitle="Tien hang chua thanh toan cho NCC" icon={<ArrowDownRight size={24}/>} />
            </div>

            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', fontWeight: '800', color: '#0f172a' }}>Chi tiet cong no theo nha cung cap</div>
              <div style={{ padding: '24px' }}>
                <DataTable columns={debtColumns} data={debtData} isLoading={isLoading} emptyMessage="Khong co khoan no nao duoc ghi nhan." onRowClick={openDebtDetail} />
              </div>
            </div>
          </div>
        )}

      </div>

      <OrderDetailModalShell
        isOpen={revenueDetailOpen}
        onClose={() => setRevenueDetailOpen(false)}
        title={`Chi tiet doanh thu ngay ${revenueDetailDate ? new Date(revenueDetailDate).toLocaleDateString('vi-VN') : ''}`}
        size="xl"
      >
        {revenueDetailError && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-rose-50 text-rose-700 text-sm font-semibold">
            {revenueDetailError}
          </div>
        )}
        <DataTable
          columns={revenueDetailColumns}
          data={revenueDetailOrders}
          isLoading={revenueDetailLoading}
          emptyMessage="Khong co don hang nao trong ngay nay."
        />
      </OrderDetailModalShell>

      <OrderDetailModalShell
        isOpen={debtDetailOpen}
        onClose={() => setDebtDetailOpen(false)}
        title={`Chi tiet cong no - ${debtDetailSupplier?.companyName || ''}`}
        size="xl"
      >
        {debtDetailError && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-rose-50 text-rose-700 text-sm font-semibold">
            {debtDetailError}
          </div>
        )}
        <DataTable
          columns={debtDetailColumns}
          data={debtDetailReceipts}
          isLoading={debtDetailLoading}
          emptyMessage="Khong co phieu nhap nao cho nha cung cap nay."
        />
      </OrderDetailModalShell>
    </div>
  );
};

export default Reports;
