import React from 'react';
import Modal from './Modal';
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Cập nhật Sản phẩm' : 'Tạo Sản phẩm & Phân loại mới'}
      size="lg"
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

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"><Package size={16} /> Thông tin cơ bản</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Tên sản phẩm *</label>
              <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Vd: iPhone 15 Pro Max" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Thương hiệu *</label>
              <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} placeholder="Apple, Samsung..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Danh mục *</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Bảo hành (tháng) *</label>
              <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                value={formData.warrantyPeriod} onChange={e => setFormData({ ...formData, warrantyPeriod: parseInt(e.target.value, 10) })} />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Mô tả thêm</label>
              <textarea className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500" rows="2"
                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2"><Settings2 size={16} /> Các phiên bản (Variants)</h4>
            <button onClick={addVariantField} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
              <Plus size={16} /> Thêm phân loại
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
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tồn kho *</label>
                    <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                      value={v.stockQuantity} onChange={e => updateVariant(index, 'stockQuantity', e.target.value)} placeholder="0" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Thuộc tính</label>
                    <VariantAttributesEditor
                      attributes={v.attributesList || [{ name: '', value: '' }]}
                      onAdd={() => addVariantAttribute(index)}
                      onChange={(attrIndex, field, value) => updateVariantAttribute(index, attrIndex, field, value)}
                      onRemove={(attrIndex) => removeVariantAttribute(index, attrIndex)}
                    />
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
      </div>
    </Modal>
  );
};

export default ProductModal;
