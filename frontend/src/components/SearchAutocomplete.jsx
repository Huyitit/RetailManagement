import React, { useState, useEffect, useRef } from 'react';

const SearchAutocomplete = ({ 
  onSearch, // Function that returns a Promise resolving to data array
  onSelect, // Function called when an item is selected
  placeholder = "Tìm kiếm...",
  renderItem, // Function to render each row in dropdown
  displayValue, // Function to get string value from selected item for input
  icon,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          console.error("Search failed:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  const handleSelect = (item) => {
    setQuery(''); // Reset query or set to displayValue(item) depending on use case
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          type="text"
          className={`w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block ${icon ? 'pl-10' : 'pl-4'} p-2.5 transition-all`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border border-slate-100 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <ul className="py-1 divide-y divide-slate-50">
            {results.map((item, index) => (
              <li 
                key={index}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                {renderItem ? renderItem(item) : (displayValue ? displayValue(item) : 'Kết quả')}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isOpen && query.length > 1 && results.length === 0 && !isLoading && (
         <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border border-slate-100 p-4 text-center text-sm text-slate-500">
           Không tìm thấy kết quả phù hợp.
         </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
