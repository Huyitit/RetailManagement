import React, { useState, useEffect } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductById,
  createVariant,
  updateVariant as updateVariantApi,
  deleteVariant as deleteVariantApi
} from '../services/api';
import OrdersTable from '../components/OrdersTable';
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

  const [formData, setFormData] = useState({
    categoryId: '', name: '', brand: '', description: '', warrantyPeriod: 12
  });

  const [variants, setVariants] = useState([]);
  const [removedVariantIds, setRemovedVariantIds] = useState([]);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getProducts({ q: search });
      const rows = Array.isArray(response.data) ? response.data : [];
      setData(rows);
      setPagination({ currentPage: 1, totalPages: 1, totalItems: rows.length });
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

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchProducts(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleOpenModal = async (product = null) => {
    setError('');
    if (product) {
      setIsEditMode(true);
      setCurrentProduct(product);
      setIsModalOpen(true);
      try {
        const response = await getProductById(product.productId);
        const detail = response.data;
        setFormData({
          categoryId: detail.categoryId,
          name: detail.productName || '',
          brand: detail.brand || '',
          description: detail.description || '',
          warrantyPeriod: detail.warrantyPeriod
        });
        setVariants((detail.Variants || []).map((variant) => ({
          variantId: variant.id,
          sku: variant.skuCode || '',
          price: variant.sellPrice || '',
          importPrice: variant.importPrice || '',
          discount: variant.discount || '',
          minStock: variant.minStock || '',
          stockQuantity: variant.stockQuantity ?? 0,
          attributesList: (variant.attributeValues || []).map((attr) => ({
            name: attr.attribute?.name || '',
            value: attr.value || ''
          }))
        })));
        setRemovedVariantIds([]);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải chi tiết sản phẩm.');
      }
      return;
    }
    setIsEditMode(false);
    setCurrentProduct(null);
    setFormData({ categoryId: categories[0]?.categoryId || '', name: '', brand: '', description: '', warrantyPeriod: 12 });
    setVariants([{
      sku: '', price: '', importPrice: '', discount: '', minStock: '', stockQuantity: 0,
      attributesList: [{ name: '', value: '' }]
    }]);
    setRemovedVariantIds([]);
    setIsModalOpen(true);
  };

  const addVariantField = () => {
    setVariants([...variants, {
      sku: '', price: '', importPrice: '', discount: '', minStock: '', stockQuantity: 0,
      attributesList: [{ name: '', value: '' }]
    }]);
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
    const target = variants[index];
    if (isEditMode && target?.variantId) {
      setRemovedVariantIds((prev) => (prev.includes(target.variantId) ? prev : [...prev, target.variantId]));
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const attributesFromVariant = (attributesList) => (attributesList || [])
    .map((attr) => ({ name: attr.name?.trim() || '', value: attr.value?.trim() || '' }))
    .filter((attr) => attr.name && attr.value);

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId || !formData.brand) {
      setError('Vui lòng điền đủ thông tin cơ bản sản phẩm (Tên, Danh mục, Thương hiệu).');
      return;
    }
    if (!isEditMode && variants.length === 0) {
      setError('Phải có ít nhất 1 phiên bản (Variant) cho sản phẩm mới.');
      return;
    }
    const hasInvalidPrice = variants.some((variant) => {
      const price = Number(variant.price);
      return !Number.isFinite(price) || price <= 0;
    });
    if (hasInvalidPrice) {
      setError('Giá bán của mỗi phiên bản phải lớn hơn 0.');
      return;
    }

    try {
      if (isEditMode) {
        await updateProduct(currentProduct.productId, {
          productName: formData.name,
          categoryId: formData.categoryId,
          brand: formData.brand,
          description: formData.description,
          warrantyPeriod: formData.warrantyPeriod
        });

        const updateRequests = variants.filter((v) => v.variantId).map((v) => updateVariantApi(v.variantId, {
          skuCode: v.sku,
          sellPrice: Number(v.price),
          importPrice: v.importPrice === '' ? undefined : Number(v.importPrice),
          discount: v.discount === '' ? undefined : Number(v.discount),
          minStock: v.minStock === '' ? undefined : Number(v.minStock),
          stockQuantity: Number(v.stockQuantity),
          attributes: attributesFromVariant(v.attributesList)
        }));
        const createRequests = variants.filter((v) => !v.variantId).map((v) => createVariant({
          productId: currentProduct.productId,
          skuCode: v.sku,
          sellPrice: Number(v.price),
          importPrice: v.importPrice === '' ? undefined : Number(v.importPrice),
          stockQuantity: Number(v.stockQuantity),
          attributes: attributesFromVariant(v.attributesList)
        }));
        const deleteRequests = removedVariantIds.map((id) => deleteVariantApi(id));

        await Promise.all([...updateRequests, ...createRequests, ...deleteRequests]);
      } else {
        await createProduct({
          productName: formData.name,
          categoryId: formData.categoryId,
          brand: formData.brand,
          description: formData.description,
          warrantyPeriod: formData.warrantyPeriod,
          variants: variants.map((v) => ({
            skuCode: v.sku,
            sellPrice: Number(v.price),
            importPrice: v.importPrice === '' ? undefined : Number(v.importPrice),
            stockQuantity: Number(v.stockQuantity),
            attributes: attributesFromVariant(v.attributesList)
          }))
        });
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  const handleDelete = async (product) => {
    const productLabel = product.productName || product.name || 'sản phẩm';
    if (window.confirm(`Bạn có chắc muốn xóa/ngừng kinh doanh sản phẩm "${productLabel}"?`)) {
      try {
        await deleteProduct(product.productId);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  const productThumbStyle = {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-muted)',
    color: 'var(--text-muted)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '14px',
    border: '1px solid var(--border-strong)',
    flexShrink: 0
  };

  const columns = [
    {
      header: 'Sản phẩm', accessor: 'productName', render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={productThumbStyle}><Package size={24} /></div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '15px' }}>
              {row.productName || 'N/A'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
              {row.brand}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Danh mục', accessor: 'categoryId', render: (row) => (
        <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{row.category || 'N/A'}</div>
      )
    },
    {
      header: 'Bảo hành', accessor: 'warrantyPeriod', align: 'center', render: (row) => (
        <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{row.warrantyPeriod} tháng</div>
      )
    },
    {
      header: 'Phân loại (Variants)', accessor: 'variants', align: 'center', render: (row) => (
        <span className="tag tag-primary">
          <Layers size={14} /> {row.variants?.length || 0}
        </span>
      )
    },
    {
      header: 'Trạng thái', accessor: 'status', render: (row) => (
        <StatusBadge status={row.status || 'Active'} />
      )
    }
  ];

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">Danh mục sản phẩm</h1>
          <p className="page-subtitle">Quản lý kho hàng, thương hiệu và các phân loại giá</p>
        </div>
        <button type="button" onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </header>

      <div className="page-body custom-scrollbar">
        <div className="surface-card-flush">
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Danh sách sản phẩm
            </div>
            <div style={{ position: 'relative', width: '320px' }}>
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
                placeholder="Tìm theo tên sản phẩm, thương hiệu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-pill"
                style={{ paddingLeft: '44px', background: 'var(--page-bg)' }}
              />
            </div>
          </div>

          <div style={{ padding: '20px 24px' }}>
            <OrdersTable
              columns={columns}
              data={data}
              isLoading={isLoading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              pagination={{ ...pagination, onPageChange: fetchProducts }}
            />
          </div>
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
