import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { Package, Plus, Search, Layers, Settings2, Trash2 } from 'lucide-react';

const Products = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Base Product Form
  const [formData, setFormData] = useState({ 
    categoryId: '', name: '', brand: '', description: '', warrantyPeriod: 12 
  });
  
  // Dynamic Variants Builder
  const [variants, setVariants] = useState([]);

  const [error, setError] = useState('');

  const fetchProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getProducts({ page, limit: 10, search });
      if (response.data?.status === 'success') {
        setData(response.data.data);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalItems
        });
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.data?.status === 'success') {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleOpenModal = (product = null) => {
    setError('');
    if (product) {
      setIsEditMode(true);
      setCurrentProduct(product);
      setFormData({
        categoryId: product.categoryId,
        name: product.name,
        brand: product.brand,
        description: product.description || '',
        warrantyPeriod: product.warrantyPeriod
      });
      // Flatten variants for edit mode (assuming product brings its variants, if not need separate fetch)
      // Usually product list endpoint returns base info. Edit mode might be complex if we can't edit variants via product API.
      // For now, assume variants array is available or we only edit base product info.
      setVariants(product.Variants || []);
    } else {
      setIsEditMode(false);
      setCurrentProduct(null);
      setFormData({ categoryId: categories[0]?.categoryId || '', name: '', brand: '', description: '', warrantyPeriod: 12 });
      setVariants([{ sku: '', price: '', stockQuantity: 0, attributes: { color: '', capacity: '' } }]);
    }
    setIsModalOpen(true);
  };

  const addVariantField = () => {
    setVariants([...variants, { sku: '', price: '', stockQuantity: 0, attributes: { color: '', capacity: '' } }]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    if (field === 'color' || field === 'capacity') {
      newVariants[index].attributes[field] = value;
    } else {
      newVariants[index][field] = value;
    }
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId || !formData.brand) {
      setError('Vui lòng điền đủ thông tin cơ bản sản phẩm (Tên, Danh mục, Thương hiệu).');
      return;
    }

    if (!isEditMode && variants.length === 0) {
      setError('Phải có ít nhất 1 phiên bản (Variant) cho sản phẩm mới.');
      return;
    }

    try {
      if (isEditMode) {
        // Just update base product
        await updateProduct(currentProduct.productId, formData);
      } else {
        // Create Product + Variants
        const payload = {
          ...formData,
          variants: variants.map(v => ({
            sku: v.sku,
            price: Number(v.price),
            stockQuantity: Number(v.stockQuantity),
            attributes: v.attributes
          }))
        };
        await createProduct(payload);
      }
      setIsModalOpen(false);
      fetchProducts(pagination.currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Bạn có chắc muốn xóa/ngừng kinh doanh sản phẩm "${product.name}"?`)) {
      try {
        await deleteProduct(product.productId);
        fetchProducts(pagination.currentPage);
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  const columns = [
    { header: 'Sản phẩm', accessor: 'name', render: (row) => (
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mr-4 border border-slate-200 shadow-sm">
          <Package size={24} />
        </div>
        <div>
          <div className="font-bold text-slate-900 text-base">{row.name}</div>
          <div className="text-sm text-slate-500 font-medium mt-0.5">{row.brand}</div>
        </div>
      </div>
    )},
    { header: 'Danh mục', accessor: 'categoryId', render: (row) => (
      <div className="font-medium text-slate-700">
        {row.Category?.categoryName || 'N/A'}
      </div>
    )},
    { header: 'Bảo hành', accessor: 'warrantyPeriod', align: 'center', render: (row) => (
      <div className="text-slate-600 font-semibold">{row.warrantyPeriod} tháng</div>
    )},
    { header: 'Phân loại (Variants)', accessor: 'variants', align: 'center', render: (row) => (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm">
        <Layers size={14} /> {row.Variants?.length || 0}
      </div>
    )},
    { header: 'Trạng thái', accessor: 'status', render: (row) => (
      <StatusBadge status={row.isDeleted ? 'Discontinued' : 'Active'} />
    )}
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      <header style={{ padding: '32px 40px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Danh mục Sản phẩm</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>Quản lý kho hàng, thương hiệu và các phân loại giá</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ background: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
        >
          <Plus size={18} /> Thêm Sản phẩm
        </button>
      </header>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '24px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm, thương hiệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: '600', fontSize: '14px' }}
            />
          </div>

          <DataTable 
            columns={columns} 
            data={data} 
            isLoading={isLoading}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            pagination={{ ...pagination, onPageChange: fetchProducts }}
          />
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Cập nhật Sản phẩm' : 'Tạo Sản phẩm & Phân loại mới'}
        size="lg"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors">Hủy</button>
            <button onClick={handleSave} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">Lưu Sản Phẩm</button>
          </>
        }
      >
        <div className="space-y-6">
          {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">{error}</div>}
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"><Package size={16}/> Thông tin cơ bản</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Tên sản phẩm *</label>
                <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vd: iPhone 15 Pro Max" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Thương hiệu *</label>
                <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="Apple, Samsung..." />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Danh mục *</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Bảo hành (tháng) *</label>
                <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={formData.warrantyPeriod} onChange={e => setFormData({...formData, warrantyPeriod: parseInt(e.target.value)})} />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Mô tả thêm</label>
                <textarea className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" rows="2"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
            </div>
          </div>

          {!isEditMode && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2"><Settings2 size={16}/> Các phiên bản (Variants)</h4>
                <button onClick={addVariantField} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus size={16}/> Thêm phân loại
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((v, index) => (
                  <div key={index} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-slate-200 relative group">
                    <div className="grid grid-cols-4 gap-3 flex-1">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Mã SKU *</label>
                        <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                          value={v.sku} onChange={e => updateVariant(index, 'sku', e.target.value)} placeholder="IP15P-256-BLK" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Giá bán (₫) *</label>
                        <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                          value={v.price} onChange={e => updateVariant(index, 'price', e.target.value)} placeholder="28000000" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Màu sắc (Color)</label>
                        <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                          value={v.attributes.color} onChange={e => updateVariant(index, 'color', e.target.value)} placeholder="Black" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Dung lượng (Capacity)</label>
                        <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                          value={v.attributes.capacity} onChange={e => updateVariant(index, 'capacity', e.target.value)} placeholder="256GB" />
                      </div>
                    </div>
                    {variants.length > 1 && (
                      <button onClick={() => removeVariant(index)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-5">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {isEditMode && (
            <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium border border-amber-100 flex items-center gap-2">
              <Settings2 size={16}/> Chế độ sửa: Chỉ cho phép cập nhật thông tin chung. Để quản lý giá hoặc thêm phân loại mới, vui lòng vào chi tiết sản phẩm.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Products;
