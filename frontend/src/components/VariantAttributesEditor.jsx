import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const VariantAttributesEditor = ({ attributes, onAdd, onChange, onRemove }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {attributes.map((attr, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            className="input-pill"
            placeholder="Thuộc tính (VD: Color)"
            value={attr.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              className="input-pill"
              placeholder="Giá trị (VD: Black)"
              value={attr.value}
              onChange={(e) => onChange(index, 'value', e.target.value)}
            />
            {attributes.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label="Xóa thuộc tính"
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface)',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                className="hover-red"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="btn-secondary"
        style={{ alignSelf: 'flex-start', fontSize: '13px' }}
      >
        <Plus size={16} /> Thêm thuộc tính
      </button>
    </div>
  );
};

export default VariantAttributesEditor;
