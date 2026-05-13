import React from 'react';
import OrderDetailModalShell from './OrderDetailModalShell';
import VariantAttributesEditor from './VariantAttributesEditor';
import { Plus, Settings2, Trash2 } from 'lucide-react';

const sectionCardStyle = {
  background: 'var(--primary-light)',
  border: '1px solid var(--primary-glow)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px'
};

const sectionTitleStyle = {
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--text-muted)',
  marginBottom: '12px'
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '6px'
};

const ProductModal = ({
  isOpen,
  onClose,
  isEditMode,
  formData,
  setFormData,
  categories,
  variants,
  addVariantField,
  updateVariant,
  removeVariant,
  addVariantAttribute,
  updateVariantAttribute,
  removeVariantAttribute,
  error,
  onSave
}) => {
  return (
    <OrderDetailModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Cập nhật Sản phẩm' : 'Tạo Sản phẩm & Phân loại mới'}
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary">Hủy</button>
          <button type="button" onClick={onSave} className="btn-primary">Lưu Sản Phẩm</button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {error && (
          <div
            style={{
              padding: '14px 16px',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 600,
              border: '1px solid rgba(239, 68, 68, 0.25)'
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <div style={sectionCardStyle}>
            <div style={sectionTitleStyle}>Thông tin cơ bản</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Tên sản phẩm *</label>
                <input
                  type="text"
                  className="input-pill"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: iPhone 15 Pro Max"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Thương hiệu *</label>
                  <input
                    type="text"
                    className="input-pill"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Apple, Samsung..."
                  />
                </div>
                <div>
                  <label style={labelStyle}>Danh mục *</label>
                  <select
                    className="input-pill"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Bảo hành (tháng) *</label>
                <input
                  type="number"
                  className="input-pill"
                  value={formData.warrantyPeriod}
                  onChange={(e) => setFormData({ ...formData, warrantyPeriod: parseInt(e.target.value, 10) })}
                />
              </div>

              <div>
                <label style={labelStyle}>Mô tả thêm</label>
                <textarea
                  className="input-pill"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={sectionCardStyle}>
            <div style={sectionTitleStyle}>Giá bán & tồn kho</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Các thông tin giá và tồn kho sẽ được khai báo theo từng phiên bản ở bên dưới.
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: 0
              }}
            >
              <Settings2 size={16} /> Các phiên bản (Variants)
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {variants.map((v, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid var(--primary-glow)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(239, 246, 255, 0.5)',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Phiên bản {index + 1}
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      aria-label="Xóa phiên bản"
                      className="hover-red"
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-strong)',
                        background: 'var(--surface)',
                        color: 'var(--text-light)',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Mã SKU *</label>
                    <input
                      type="text"
                      className="input-pill"
                      value={v.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      placeholder="IP15P-256-BLK"
                      disabled={isEditMode && Boolean(v.variantId)}
                      style={isEditMode && v.variantId ? { background: 'var(--surface-muted)', color: 'var(--text-light)' } : undefined}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Giá bán (₫) *</label>
                    <input
                      type="number"
                      className="input-pill"
                      value={v.price}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      placeholder="28000000"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Giá nhập (₫)</label>
                    <input
                      type="number"
                      className="input-pill"
                      value={v.importPrice || ''}
                      onChange={(e) => updateVariant(index, 'importPrice', e.target.value)}
                      placeholder="20000000"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Giảm giá (%)</label>
                    <input
                      type="number"
                      className="input-pill"
                      value={v.discount || ''}
                      onChange={(e) => updateVariant(index, 'discount', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Tồn kho *</label>
                    <input
                      type="number"
                      className="input-pill"
                      value={v.stockQuantity}
                      onChange={(e) => updateVariant(index, 'stockQuantity', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Tồn tối thiểu</label>
                    <input
                      type="number"
                      className="input-pill"
                      value={v.minStock || ''}
                      onChange={(e) => updateVariant(index, 'minStock', e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Thuộc tính</label>
                    <VariantAttributesEditor
                      attributes={v.attributesList || [{ name: '', value: '' }]}
                      onAdd={() => addVariantAttribute(index)}
                      onChange={(attrIndex, field, value) => updateVariantAttribute(index, attrIndex, field, value)}
                      onRemove={(attrIndex) => removeVariantAttribute(index, attrIndex)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariantField}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px dashed var(--primary-glow)',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(239, 246, 255, 0.5)',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 246, 255, 0.5)')}
            >
              <Plus size={16} /> Thêm phân loại
            </button>
          </div>
        </div>
      </div>
    </OrderDetailModalShell>
  );
};

export default ProductModal;
