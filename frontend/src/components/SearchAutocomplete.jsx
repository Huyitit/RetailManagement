import React, { useState, useEffect, useRef } from 'react';

const SearchAutocomplete = ({
  onSearch,
  onSelect,
  placeholder = 'Tìm kiếm...',
  renderItem,
  displayValue,
  icon,
  style
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const data = await onSearch(query);
          setResults(data);
          setIsOpen(true);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  const handleSelect = (item) => {
    setQuery('');
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', ...style }}>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '14px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: 'var(--text-light)'
            }}
          >
            {icon}
          </div>
        )}
        <input
          type="text"
          className="input-pill"
          style={{ paddingLeft: icon ? '44px' : '16px' }}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: '14px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid var(--primary)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            zIndex: 50,
            marginTop: '6px',
            width: '100%',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-light)',
            maxHeight: '260px',
            overflowY: 'auto'
          }}
        >
          <ul style={{ listStyle: 'none', padding: '4px 0', margin: 0 }}>
            {results.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-light)',
                  fontSize: '14px',
                  color: 'var(--text-main)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {renderItem ? renderItem(item) : (displayValue ? displayValue(item) : 'Kết quả')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query.length > 1 && results.length === 0 && !isLoading && (
        <div
          style={{
            position: 'absolute',
            zIndex: 50,
            marginTop: '6px',
            width: '100%',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-light)',
            padding: '14px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}
        >
          Không tìm thấy kết quả phù hợp.
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
