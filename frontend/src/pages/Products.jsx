import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../services/api';
import DataTable from '../components/DataTable';
import ProductModal from '../components/ProductModal';
import StatusBadge from '../components/StatusBadge';
import { Package, Plus, Search, Layers } from 'lucide-react';

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
      const response = await getProducts({ q: search });
      const rows = Array.isArray(response.data) ? response.data : [];
      setData(rows);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: rows.length
      });
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const rows = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCategories(rows);
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
        name: product.productName || product.name || '',
        brand: product.brand || '',
        description: product.productDescription || product.description || '',
        warrantyPeriod: product.warrantyPeriod
      });
      // Flatten variants for edit mode (assuming product brings its variants, if not need separate fetch)
      // Usually product list endpoint returns base info. Edit mode might be complex if we can't edit variants via product API.
      // For now, assume variants array is available or we only edit base product info.
      setVariants((product.variants || []).map((variant) => ({
        sku: variant.SKU || variant.skuCode || '',
        price: variant.sellPrice || '',
        stockQuantity: variant.quantity ?? 0,
        attributesList: (variant.attributes || []).map((attr) => ({
          name: attr.name || '',
          value: attr.value || ''
        }))
      })));
    } else {
      setIsEditMode(false);
      setCurrentProduct(null);
      setFormData({ categoryId: categories[0]?.categoryId || '', name: '', brand: '', description: '', warrantyPeriod: 12 });
      setVariants([{ sku: '', price: '', stockQuantity: 0, attributesList: [{ name: '', value: '' }] }]);
    }
    setIsModalOpen(true);
  };

  const addVariantField = () => {
    setVariants([...variants, { sku: '', price: '', stockQuantity: 0, attributesList: [{ name: '', value: '' }] }]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariantAttribute = (variantIndex) => {
    setVariants((prev) => prev.map((variant, index) => {
      if (index !== variantIndex) return variant;
      const attributesList = variant.attributesList || [];
      return { ...variant, attributesList: [...attributesList, { name: '', value: '' }] };
    }));
  };

  const updateVariantAttribute = (variantIndex, attrIndex, field, value) => {
    setVariants((prev) => prev.map((variant, index) => {
      if (index !== variantIndex) return variant;
      const attributesList = (variant.attributesList || []).map((attr, aIndex) => {
        if (aIndex !== attrIndex) return attr;
        return { ...attr, [field]: value };
      });
      return { ...variant, attributesList };
    }));
  };

  const removeVariantAttribute = (variantIndex, attrIndex) => {
    setVariants((prev) => prev.map((variant, index) => {
      if (index !== variantIndex) return variant;
      const attributesList = (variant.attributesList || []).filter((_, aIndex) => aIndex !== attrIndex);
      return { ...variant, attributesList: attributesList.length ? attributesList : [{ name: '', value: '' }] };
    }));
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
        await updateProduct(currentProduct.productId, {
          productName: formData.name,
          categoryId: formData.categoryId,
          brand: formData.brand,
          description: formData.description,
          warrantyPeriod: formData.warrantyPeriod
        });
      } else {
        // Create Product + Variants
        const attributesFromVariant = (attributesList) => {
          return (attributesList || [])
            .map((attr) => ({
              name: attr.name?.trim() || '',
              value: attr.value?.trim() || ''
            }))
            .filter((attr) => attr.name && attr.value);
        };

        const payload = {
          productName: formData.name,
          categoryId: formData.categoryId,
          brand: formData.brand,
          description: formData.description,
          warrantyPeriod: formData.warrantyPeriod,
          variants: variants.map(v => ({
            skuCode: v.sku,
            sellPrice: Number(v.price),
            stockQuantity: Number(v.stockQuantity),
            attributes: attributesFromVariant(v.attributesList)
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
    const productLabel = product.productName || product.name || 'sản phẩm';
    if (window.confirm(`Bạn có chắc muốn xóa/ngừng kinh doanh sản phẩm "${productLabel}"?`)) {
      try {
        await deleteProduct(product.productId);
        fetchProducts(pagination.currentPage);
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  const columns = [
    { header: 'Sản phẩm', accessor: 'productName', render: (row) => (
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mr-4 border border-slate-200 shadow-sm">
          <Package size={24} />
        </div>
        <div>
          <div className="font-bold text-slate-900 text-base">{row.productName || 'N/A'}</div>
          <div className="text-sm text-slate-500 font-medium mt-0.5">{row.brand || 'N/A'}</div>
        </div>
      </div>
    )},
    { header: 'Danh mục', accessor: 'categoryId', render: (row) => (
      <div className="font-medium text-slate-700">
        {row.category || 'N/A'}
      </div>
    )},
    { header: 'Bảo hành', accessor: 'warrantyPeriod', align: 'center', render: (row) => (
      <div className="text-slate-600 font-semibold">{row.warrantyPeriod} tháng</div>
    )},
    { header: 'Phân loại (Variants)', accessor: 'variants', align: 'center', render: (row) => (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm">
        <Layers size={14} /> {row.variants?.length || 0}
      </div>
    )},
    { header: 'Trạng thái', accessor: 'status', render: (row) => (
      <StatusBadge status={row.status || 'Active'} />
    )}
  ];

  return (
    <div className="products-page">
      <header className="products-header">
        <div>
          <h1 className="products-title">Danh mục Sản phẩm</h1>
          <p className="products-subtitle">Quản lý kho hàng, thương hiệu và các phân loại giá</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="products-add-btn"
        >
          <Plus size={18} /> Thêm Sản phẩm
        </button>
      </header>

      <div className="products-body custom-scrollbar">
        <div className="products-card">
          <div className="products-search">
            <Search size={18} className="products-search-icon" />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm, thương hiệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="products-search-input"
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        variants={variants}
        addVariantField={addVariantField}
        updateVariant={updateVariant}
        removeVariant={removeVariant}
        addVariantAttribute={addVariantAttribute}
        updateVariantAttribute={updateVariantAttribute}
        removeVariantAttribute={removeVariantAttribute}
        error={error}
        onSave={handleSave}
      />
    </div>
  );
};

export default Products;
