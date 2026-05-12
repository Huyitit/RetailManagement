import React, { useState, useEffect } from 'react';
import { getRevenueReport, getInventoryReport, getDebtReport } from '../services/api';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import { BarChart3, TrendingUp, AlertTriangle, Wallet, ArrowDownRight, PackageOpen } from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('revenue'); // revenue, inventory, debt
  const [isLoading, setIsLoading] = useState(true);
  
  // States
  const [revenueData, setRevenueData] = useState({ summary: {}, daily: [] });
  const [inventoryData, setInventoryData] = useState([]);
  const [debtData, setDebtData] = useState({ totalDebt: 0, details: [] });
  
  // Filters
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // 1st of month
    end: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'revenue') {
        const res = await getRevenueReport({ startDate: dateRange.start, endDate: dateRange.end });
        if (res.data?.status === 'success') setRevenueData(res.data.data);
      } else if (activeTab === 'inventory') {
        const res = await getInventoryReport({ type: 'low_stock', threshold: 10 });
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
  }, [activeTab, dateRange]);

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN').format(Math.round(val || 0)) + ' đ';

  // --- Revenue Renderers ---
  const revenueColumns = [
    { header: 'Ngày', accessor: 'date', render: (row) => <div className="font-bold">{new Date(row.date).toLocaleDateString('vi-VN')}</div> },
    { header: 'Số lượng đơn', accessor: 'orderCount', align: 'center', render: (row) => <span className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold">{row.orderCount}</span> },
    { header: 'Doanh thu thuần', accessor: 'revenue', align: 'right', render: (row) => <span className="font-bold text-indigo-700">{formatMoney(row.revenue)}</span> }
  ];

  // --- Inventory Renderers ---
  const inventoryColumns = [
    { header: 'Mã SKU', accessor: 'sku', render: (row) => <span className="font-bold text-slate-800">{row.sku}</span> },
    { header: 'Sản phẩm', accessor: 'name', render: (row) => <span className="text-sm">{row.Product?.name || 'N/A'}</span> },
    { header: 'Tồn kho hiện tại', accessor: 'stockQuantity', align: 'center', render: (row) => (
      <span className={`px-2 py-1 rounded-md text-xs font-bold ${row.stockQuantity <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
        {row.stockQuantity}
      </span>
    )},
    { header: 'Giá bán', accessor: 'price', align: 'right', render: (row) => <span>{formatMoney(row.price)}</span> }
  ];

  // --- Debt Renderers ---
  const debtColumns = [
    { header: 'Nhà cung cấp', accessor: 'supplierName', render: (row) => <span className="font-bold text-slate-800">{row.supplierName}</span> },
    { header: 'Tổng nhập', accessor: 'totalImportValue', align: 'right', render: (row) => <span>{formatMoney(row.totalImportValue)}</span> },
    { header: 'Đã thanh toán', accessor: 'totalPaid', align: 'right', render: (row) => <span className="text-emerald-600">{formatMoney(row.totalPaid)}</span> },
    { header: 'Còn nợ', accessor: 'remainingDebt', align: 'right', render: (row) => <span className="font-bold text-rose-600">{formatMoney(row.remainingDebt)}</span> }
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
        
        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-slate-200 pb-2">
          <button onClick={() => setActiveTab('revenue')}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'revenue' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <BarChart3 size={18}/> Doanh thu bán hàng
          </button>
          <button onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'inventory' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <AlertTriangle size={18}/> Cảnh báo tồn kho
          </button>
          <button onClick={() => setActiveTab('debt')}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'debt' ? 'border-rose-500 text-rose-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <Wallet size={18}/> Công nợ nhà cung cấp
          </button>
        </div>

        {/* Content based on Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><BarChart3 size={18} className="text-indigo-500"/> Tổng quan doanh thu</h3>
              <div className="flex gap-4">
                <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"/>
                <span className="text-slate-400 self-center">đến</span>
                <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Tổng Doanh Thu" value={formatMoney(revenueData.summary?.totalRevenue)} icon={<TrendingUp size={24}/>} />
              <StatCard title="Số đơn hoàn thành" value={revenueData.summary?.totalOrders || 0} icon={<PackageOpen size={24}/>} />
              <StatCard title="Lợi nhuận gộp (Ước tính)" value={formatMoney((revenueData.summary?.totalRevenue || 0) * 0.3)} subtitle="~30% biên lợi nhuận" icon={<BarChart3 size={24}/>} />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Chi tiết theo ngày</h3>
              <DataTable columns={revenueColumns} data={revenueData.daily} isLoading={isLoading} />
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <StatCard title="Sản phẩm sắp hết hàng" value={inventoryData.length} subtitle="Tồn kho dưới 10 sản phẩm" icon={<AlertTriangle size={24}/>} />
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Danh sách hàng cần nhập thêm</h3>
              <DataTable columns={inventoryColumns} data={inventoryData} isLoading={isLoading} emptyMessage="Kho đang ở trạng thái an toàn, không có sản phẩm sắp hết." />
            </div>
          </div>
        )}

        {activeTab === 'debt' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <StatCard title="Tổng công nợ cần trả" value={formatMoney(debtData.totalDebt)} subtitle="Tiền hàng chưa thanh toán cho NCC" icon={<ArrowDownRight size={24}/>} />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Chi tiết công nợ theo nhà cung cấp</h3>
              <DataTable columns={debtColumns} data={debtData.details} isLoading={isLoading} emptyMessage="Không có khoản nợ nào được ghi nhận." />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reports;
