import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const VariantAttributesEditor = ({
  attributes,
  onAdd,
  onChange,
  onRemove
}) => {
  return (
    <div className="space-y-3">
      {attributes.map((attr, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          <input
            type="text"
            className="w-full border border-indigo-100 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            placeholder="Thuộc tính (VD: Color)"
            value={attr.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="w-full border border-indigo-100 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              placeholder="Giá trị (VD: Black)"
              value={attr.value}
              onChange={(e) => onChange(index, 'value', e.target.value)}
            />
            {attributes.length > 1 && (
              <button
                onClick={() => onRemove(index)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                aria-label="Xoa thuoc tinh"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="text-sm font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 bg-white border border-indigo-100 px-3 py-2 rounded-xl transition-colors"
      >
        <Plus size={16} /> Them thuoc tinh
      </button>
    </div>
  );
};

export default VariantAttributesEditor;
