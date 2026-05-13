import React from 'react';
import OrderDetailModalShell from './OrderDetailModalShell';
import VariantAttributesEditor from './VariantAttributesEditor';
import { Package, Plus, Settings2, Trash2 } from 'lucide-react';

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
  const inputClass = 'w-full border border-indigo-100 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white';
  const labelClass = 'text-xs font-semibold text-slate-600';
  const sectionCard = 'bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4';

  return (
    <OrderDetailModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Cập nhật Sản phẩm' : 'Tạo Sản phẩm & Phân loại mới'}
      size="xl"
      bodyClassName={isEditMode ? 'max-h-[70vh]' : ''}
      footer={
        <>
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors">Hủy</button>
          <button onClick={onSave} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">Lưu Sản Phẩm</button>
        </>
      }
    >
      <div className="space-y-6">
        {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={sectionCard}>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">Thông tin cơ bản</div>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Tên sản phẩm *</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Vd: iPhone 15 Pro Max"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Thương hiệu *</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Apple, Samsung..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Danh mục *</label>
                  <select
                    className={inputClass}
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Bảo hành (tháng) *</label>
                <input
                  type="number"
                  className={inputClass}
                  value={formData.warrantyPeriod}
                  onChange={e => setFormData({ ...formData, warrantyPeriod: parseInt(e.target.value, 10) })}
                />
              </div>

              <div>
                <label className={labelClass}>Mô tả thêm</label>
                <textarea
                  className={inputClass}
                  rows="2"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>

          <div className={sectionCard}>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">Giá bán & tồn kho</div>
            <div className="text-sm text-slate-500">
              Các thông tin giá và tồn kho sẽ được khai báo theo từng phiên bản ở bên dưới.
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2"><Settings2 size={16} /> Các phiên bản (Variants)</h4>
          </div>

          <div className="space-y-4">
            {variants.map((v, index) => (
              <div key={index} className="border border-indigo-100 rounded-2xl bg-indigo-50/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Phiên bản {index + 1}</div>
                  {variants.length > 1 && (
                    <button onClick={() => removeVariant(index)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Mã SKU *</label>
                    <input
                      type="text"
                      className={`${inputClass} disabled:bg-slate-100 disabled:text-slate-500`}
                      value={v.sku}
                      onChange={e => updateVariant(index, 'sku', e.target.value)}
                      placeholder="IP15P-256-BLK"
                      disabled={isEditMode && Boolean(v.variantId)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Giá bán (₫) *</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={v.price}
                      onChange={e => updateVariant(index, 'price', e.target.value)}
                      placeholder="28000000"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Giá nhập (₫)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={v.importPrice || ''}
                      onChange={e => updateVariant(index, 'importPrice', e.target.value)}
                      placeholder="20000000"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Giảm giá (%)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={v.discount || ''}
                      onChange={e => updateVariant(index, 'discount', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tồn kho *</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={v.stockQuantity}
                      onChange={e => updateVariant(index, 'stockQuantity', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Tồn tối thiểu</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={v.minStock || ''}
                      onChange={e => updateVariant(index, 'minStock', e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Thuộc tính</label>
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
              onClick={addVariantField}
              className="w-full border-2 border-dashed border-indigo-200 rounded-2xl py-3 text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
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
