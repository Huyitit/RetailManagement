import React, { useState, useEffect, useRef } from 'react';
import {
  Search, ShoppingCart, Trash2, Plus, Minus, CreditCard,
  User, X, QrCode, Banknote, CheckCircle, Printer, Gift,
  FileText, Check, ArrowLeft, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5001/api/v1';

const apiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      ...options,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    return res.json();
  } catch (err) {
    console.error(`API call failed for ${endpoint}:`, err);
    return null;
  }
};

const getProducts = () => apiCall('/products');
const getCategories = () => apiCall('/categories');
const searchCustomers = (q) => apiCall(`/customers?q=${encodeURIComponent(q)}&_t=${Date.now()}`);
const createDraftOrder = async (staffId, customerId) => {
  const response = await apiCall('/orders', { method: 'POST', body: JSON.stringify({ staffId, customerId }) });
  return response?.data || response || { receiptId: 0 };
};
const addOrderItem = (receiptId, variantId, quantity) =>
  apiCall(`/orders/${receiptId}/items`, { method: 'POST', body: JSON.stringify({ variantId, quantity }) });
const updateOrderItem = (receiptId, variantId, quantity) =>
  apiCall(`/orders/${receiptId}/items`, { method: 'PUT', body: JSON.stringify({ variantId, quantity }) });
const deleteOrderItem = (receiptId, variantId) =>
  apiCall(`/orders/${receiptId}/items/${variantId}`, { method: 'DELETE' });
const checkoutOrder = (receiptId, data) =>
  apiCall(`/orders/${receiptId}/checkout`, { method: 'PATCH', body: JSON.stringify(data) });
const createNewCustomer = (fullName, phoneNumber) =>
  apiCall('/customers', { method: 'POST', body: JSON.stringify({ fullName, phoneNumber }) });

const formatOrderId = (id) => id ? `HD${String(id).padStart(6, '0')}` : 'N/A';
const formatMoney = (amount) => {
  if (isNaN(amount) || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
const parseMoney = (str) => {
  if (!str) return 0;
  return parseInt(String(str).replace(/\D/g, '') || 0);
};
const formatInputMoney = (amount) => {
  if (isNaN(amount) || amount === null) return '0';
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const POSScreen = () => {
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ categoryId: 0, categoryName: 'Tất cả' }]);
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const getSavedStaff = () => {
    const saved = localStorage.getItem('staffInfo');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        return { id: p.id || p.staffId || null, name: p.fullname || p.fullName || p.staffName || "Nhân viên" };
      } catch(e) { return { id: null, name: "Nhân viên" }; }
    }
    return { id: null, name: "Nhân viên" };
  };
  const initialStaff = getSavedStaff();
  const [staffId, setStaffId] = useState(initialStaff.id);
  const [staffName, setStaffName] = useState(initialStaff.name);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSubView, setPaymentSubView] = useState(null);
  const [amountReceived, setAmountReceived] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [printedReceipt, setPrintedReceipt] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  const activeOrderIdRef = useRef(activeOrderId);
  useEffect(() => { activeOrderIdRef.current = activeOrderId; }, [activeOrderId]);

  useEffect(() => {
    const fetchData = async () => {
      const prodRes = await getProducts();
      if (Array.isArray(prodRes)) setProducts(prodRes);
      else if (prodRes?.status === 'success') setProducts(prodRes.data || []);

      const catRes = await getCategories();
      if (Array.isArray(catRes)) setCategories([{ categoryId: 0, categoryName: 'Tất cả' }, ...catRes]);
      else if (catRes?.status === 'success') setCategories([{ categoryId: 0, categoryName: 'Tất cả' }, ...(catRes.data || [])]);

      try {
        const staffRes = await apiCall('/auth/me');
        if (staffRes?.status === 'success' && staffRes.data) {
          setStaffId(staffRes.data.id);
          setStaffName(staffRes.data.fullname || staffRes.data.fullName || staffRes.data.staffName);
        } else {
          const saved = localStorage.getItem('staffInfo');
          if (saved) {
            const parsed = JSON.parse(saved);
            setStaffId(parsed.id || parsed.staffId || 1);
            setStaffName(parsed.fullname || parsed.fullName || parsed.staffName || "Nhân viên");
          }
        }
      } catch (e) { console.warn("Staff info fetch failed"); }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (orders.length === 0 && staffId) {
      const init = async () => {
        try {
          const res = await createDraftOrder(staffId, null);
          const rId = res?.receiptId || 0;
          setOrders([{ id: 1, name: 'Đơn 1', cart: [], customerId: null, customerName: 'Khách lẻ', receiptId: rId, pointsToUse: 0, rewardPoints: 0 }]);
          setActiveOrderId(1);
        } catch (e) {
          console.error("Failed to create initial draft order:", e);
          setOrders([{ id: 1, name: 'Đơn 1', cart: [], customerId: null, customerName: 'Khách lẻ', receiptId: 0, pointsToUse: 0, rewardPoints: 0 }]);
          setActiveOrderId(1);
        }
      };
      init();
    }
  }, [staffId, orders.length]);

  const activeOrder = orders.find(o => o.id === activeOrderId);

  const updateActiveOrder = (updater) => {
    setOrders(prev => prev.map(o => o.id === activeOrderIdRef.current ? (typeof updater === 'function' ? updater(o) : { ...o, ...updater }) : o));
  };

  const calculateTotals = (cart, pointsToUse = 0) => {
    let subtotal = 0;
    let discount = 0;
    cart.forEach(item => {
      subtotal += item.unitPrice * item.quantity;
      discount += (item.unitPrice - item.finalPrice) * item.quantity;
    });

    const pointsDiscount = (pointsToUse || 0) * 1000;
    const subtotalAfterPromo = subtotal - discount;

    const tax = Math.round(subtotalAfterPromo * 0.10);

    const totalAmount = Math.max(0, subtotalAfterPromo + tax - pointsDiscount);

    const pointsEarned = Math.floor((subtotalAfterPromo + tax) / 100000);

    return { subtotal, discount, pointsDiscount, tax, totalAmount, pointsEarned };
  };

  const { subtotal, discount, pointsDiscount, tax, totalAmount, pointsEarned } = calculateTotals(activeOrder?.cart || [], activeOrder?.pointsToUse || 0);

  const filteredProducts = (products || []).filter(p => {
    const mCat = activeCategoryId === 0 || p.categoryId === activeCategoryId;
    const mSearch = String(p?.productName || '').toLowerCase().includes(String(searchQuery).toLowerCase()) ||
                   (p?.variants || []).some(v => String(v.SKU || '').toLowerCase().includes(String(searchQuery).toLowerCase()));
    return mCat && mSearch;
  });

  const addToCart = async (product) => {
    const variant = product.variants?.[0] || { variantId: product.productId, sellPrice: 0 };

    const discountPercent = variant.promotion?.discountPercent || 0;
    const finalPrice = Math.round(variant.sellPrice * (1 - discountPercent / 100));

    const attrString = variant.attributes?.length
      ? ' - ' + variant.attributes.map(a => a.value).join(' - ')
      : '';
    const fullProductName = product.productName + attrString;

    updateActiveOrder(o => {
      const existing = o.cart.find(i => i.variantId === variant.variantId);
      if (existing) return { ...o, cart: o.cart.map(i => i.variantId === variant.variantId ? { ...i, quantity: i.quantity + 1 } : i) };
      return {
        ...o,
        cart: [...o.cart, {
          variantId: variant.variantId,
          productName: product.productName,
          fullDisplayName: fullProductName,
          image: variant.imageUrl || '📦',
          unitPrice: variant.sellPrice,
          finalPrice: finalPrice,
          discountPercent: discountPercent,
          promotionName: variant.promotion?.name || null,
          quantity: 1,
          attributes: variant.attributes || []
        }]
      };
    });
    let currentReceiptId = activeOrder?.receiptId;
    
    if (!currentReceiptId || currentReceiptId === 0) {
      try {
        const res = await createDraftOrder(staffId, activeOrder?.customerId);
        currentReceiptId = res?.receiptId || 0;
        if (currentReceiptId && currentReceiptId !== 0) {
          updateActiveOrder({ receiptId: currentReceiptId });
        }
      } catch (e) {
        console.error("Failed to create draft order on the fly", e);
      }
    }

    if (currentReceiptId && currentReceiptId !== 0) {
      await addOrderItem(currentReceiptId, variant.variantId, 1);
    } else {
      console.error("Cannot add item: receiptId is still 0");
    }
  };

  const updateQty = async (vId, delta) => {
    let nQty = 1;
    updateActiveOrder(o => {
      const item = o.cart.find(i => i.variantId === vId);
      if (!item) return o;
      nQty = Math.max(1, item.quantity + delta);
      return { ...o, cart: o.cart.map(i => i.variantId === vId ? { ...i, quantity: nQty } : i) };
    });
    if (activeOrder?.receiptId && activeOrder.receiptId !== 0) updateOrderItem(activeOrder.receiptId, vId, nQty);
  };

  const handleRemoveItem = async (vId) => {
    updateActiveOrder(o => ({ ...o, cart: o.cart.filter(i => i.variantId !== vId) }));
    if (activeOrder?.receiptId && activeOrder.receiptId !== 0) deleteOrderItem(activeOrder.receiptId, vId);
  };

  const handleSearchCustomer = async (q) => {
    setCustomerSearch(q);
    if (q.length < 1) { setCustomerResults([]); setShowCustomerDropdown(false); return; }
    const res = await searchCustomers(q);
    const list = res?.data || (Array.isArray(res) ? res : []);
    setCustomerResults(list);
    setShowCustomerDropdown(true);
  };

  const handleCompletePayment = async () => {
    const method = paymentSubView === 'cash' ? 'Tiền mặt' : 'Chuyển khoản';
    const received = parseMoney(amountReceived) || totalAmount;
    try {
      const data = {
        paymentMethod: method,
        amountReceived: method === 'Tiền mặt' ? received : totalAmount,
        amountChange: method === 'Tiền mặt' ? Math.max(0, received - totalAmount) : 0,
        pointsToUse: activeOrder?.pointsToUse || 0,
        pointsEarned: activeOrder?.customerId ? pointsEarned : 0,
        customerId: activeOrder?.customerId,
        subTotal: subtotal,
        discountAmount: discount + pointsDiscount,
        taxAmount: tax,
        finalTotal: totalAmount
      };
      await checkoutOrder(activeOrder?.receiptId, data);

      const prodRes = await getProducts();
      if (Array.isArray(prodRes)) setProducts(prodRes);
      else if (prodRes?.status === 'success') setProducts(prodRes.data || []);

      setPrintedReceipt({
        receiptId: activeOrder?.receiptId,
        staffName: staffName,
        customerName: activeOrder?.customerName,
        orderAt: new Date().toISOString(),
        details: activeOrder?.cart || [],
        paymentBreakdown: {
          subtotal,
          promoDiscount: discount,
          pointsDiscount: pointsDiscount,
          tax,
          total: totalAmount
        },
        paymentMethod: method,
        pointsEarned: activeOrder?.customerId ? pointsEarned : 0,
        amountReceived: method === 'Tiền mặt' ? received : totalAmount,
        amountChange: method === 'Tiền mặt' ? Math.max(0, received - totalAmount) : 0
      });
      setShowPaymentModal(false);
      setShowReceiptModal(true);
    } catch (e) { alert(e.message); }
  };

  const finishAll = async () => {
    const cId = activeOrderId;
    setShowReceiptModal(false); setPaymentSubView(null); setAmountReceived(''); setCustomerSearch('');
    try {
      const res = await createDraftOrder(staffId, null);
      const rId = res?.receiptId || 0;
      const nId = Date.now();
      setOrders(prev => {
        const rem = prev.filter(o => o.id !== cId);
        const next = { id: nId, name: `Đơn ${rem.length + 1}`, cart: [], customerId: null, customerName: 'Khách lẻ', receiptId: rId, pointsToUse: 0, rewardPoints: 0 };
        const final = rem.length === 0 ? [next] : rem;
        setTimeout(() => setActiveOrderId(rem.length === 0 ? nId : rem[0].id), 0);
        return final;
      });
    } catch (e) {
      setOrders(prev => {
        const rem = prev.filter(o => o.id !== cId);
        const nId = Date.now();
        setTimeout(() => setActiveOrderId(nId), 0);
        return [{ id: nId, name: 'Đơn 1', cart: [], customerId: null, customerName: 'Khách lẻ', receiptId: 0, pointsToUse: 0, rewardPoints: 0 }];
      });
    }
  };

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          #pos-main-container { display: none !important; }
          .modal-backdrop {
            position: static !important;
            background: white !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .modal-content {
            display: block !important;
            width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .modal-content > div:first-child { display: none !important; }
          .modal-content > div:last-child {
            background: white !important;
            padding: 0 !important;
            display: block !important;
          }
          #printable-receipt-content {
            margin: 0 auto !important;
            width: 80mm !important;
            border: none !important;
            padding: 5mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            color: black !important;
            overflow: visible !important;
          }
          #printable-receipt-content * {
            color: black !important;
            background: transparent !important;
          }
          .modal-backdrop { background: white !important; }
        }
        .product-grid-container::-webkit-scrollbar {
      width: 8px;
    }
    .product-grid-container::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    .product-grid-container::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .product-grid-container::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `}</style>
      <div id="pos-main-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f8fafc', overflow: 'hidden' }}>

        {}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {}
          <header style={{ height: 'var(--header-height)', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'white', borderBottom: '1px solid var(--border-strong)', flexShrink: 0 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#64748b',
                fontWeight: '700',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <LayoutDashboard size={18} />
              Quản lý
            </button>
            <div className="search-container">
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="text"
                placeholder="Tìm sản phẩm (Tên, SKU)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                style={{ borderRadius: '12px', background: '#f1f5f9', border: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flex: 1, overflowX: 'auto', padding: '4px 0' }} className="no-scrollbar">
              {categories.map(c => (
                <button
                  key={c.categoryId}
                  onClick={() => setActiveCategoryId(c.categoryId)}
                  className={`category-tab ${activeCategoryId === c.categoryId ? 'active' : ''}`}
                >
                  {c.categoryName}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, paddingLeft: '16px', borderLeft: '1px solid var(--border-light)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                  Nhân viên: <b>{staffName}</b>
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staffName)}&background=0D8ABC&color=fff`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </header>

          {}
          <div style={{ flex: 1, padding: '24px', overflowY: 'scroll', maxHeight: 'calc(100vh - 140px)', background: '#f8fafc' }} className="custom-scrollbar">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px', paddingBottom: '40px' }}>
              {filteredProducts.flatMap(p => (p.variants || []).map(variant => {
                const isOutOfStock = variant.quantity <= 0;

                const fullProductName = p.productName + (variant.attributes?.length
                  ? ' - ' + variant.attributes.map(a => a.value).join(' - ')
                  : '');

                return (
                  <div
                    key={variant.variantId}
                    onClick={() => !isOutOfStock && addToCart({ ...p, variants: [variant] })}
                    style={{
                      background: 'white',
                      borderRadius: 'var(--radius-lg)',
                      padding: '0',
                      border: '1px solid var(--border-light)',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      overflow: 'hidden',
                      opacity: isOutOfStock ? 0.7 : 1,
                      position: 'relative'
                    }}
                    className="product-card"
                  >
                    <div style={{ height: '160px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {variant.imageUrl ? (
                        <img
                          src={variant.imageUrl}
                          alt={fullProductName}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                          onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                        />
                      ) : (
                        <div style={{ fontSize: '40px' }}>📦</div>
                      )}
                    </div>
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)', marginBottom: '4px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '42px' }}>
                        {p.productName}
                      </div>

                      {}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginBottom: '8px', minHeight: '20px' }}>
                        {variant.attributes?.map((attr, i) => (
                          <span key={i} style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', border: '1px solid var(--primary-glow)', textTransform: 'uppercase' }}>
                            {attr.value}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', marginBottom: '10px' }}>
                        #{variant.SKU || 'N/A'}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>{formatMoney(variant.sellPrice)}</div>
                        <div style={{ fontSize: '11px', color: isOutOfStock ? '#ef4444' : 'var(--text-muted)', fontWeight: '700' }}>
                          {isOutOfStock ? 'Hết hàng' : `Kho: ${variant.quantity}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }))}
            </div>
          </div>
        </div>

        {}
        <div style={{ width: '420px', background: 'white', borderLeft: '1px solid var(--border-strong)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
          {}
          <div style={{ display: 'flex', padding: '12px 16px 0 16px', gap: '6px', borderBottom: '1px solid var(--border-light)', background: '#f8fafc' }}>
            {orders.map(o => (
              <div
                key={o.id}
                onClick={() => setActiveOrderId(o.id)}
                style={{
                  padding: '8px 16px',
                  background: activeOrderId === o.id ? 'white' : 'transparent',
                  color: activeOrderId === o.id ? 'var(--primary)' : 'var(--text-muted)',
                  border: activeOrderId === o.id ? '1px solid var(--border-light)' : 'none',
                  borderBottom: activeOrderId === o.id ? '2px solid var(--primary)' : 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                Giỏ #{orders.indexOf(o) + 1}
                {orders.length > 1 && (
                  <X
                    size={12}
                    onClick={(e) => {
                      e.stopPropagation();
                      const nOrders = orders.filter(ord => ord.id !== o.id);
                      setOrders(nOrders);
                      if (activeOrderId === o.id) setActiveOrderId(nOrders[0].id);
                    }}
                  />
                )}
              </div>
            ))}
            <button
              onClick={async () => {
                try {
                  const res = await createDraftOrder(staffId, null);
                  const rId = res?.receiptId || 0;
                  const nId = Date.now();
                  setOrders([...orders, { id: nId, name: `Giỏ #${orders.length + 1}`, cart: [], customerId: null, customerName: 'Khách lẻ', receiptId: rId, pointsToUse: 0, rewardPoints: 0 }]);
                  setActiveOrderId(nId);
                } catch (e) {
                  const nId = Date.now();
                  setOrders([...orders, { id: nId, name: `Giỏ #${orders.length + 1}`, cart: [], customerId: null, customerName: 'Khách lẻ', receiptId: 0, pointsToUse: 0, rewardPoints: 0 }]);
                  setActiveOrderId(nId);
                }
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0 8px' }}
            >
              <Plus size={18} />
            </button>
          </div>

          <div style={{ padding: '20px 24px 16px 24px', borderBottom: '1px solid var(--border-light)', background: 'white' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Giỏ hàng hiện tại
              <span style={{ fontSize: '12px', color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--primary-glow)', fontWeight: '700' }}>{activeOrder?.cart?.length || 0} món</span>
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>Mã đơn hàng: <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{formatOrderId(activeOrder?.receiptId)}</span></div>
          </div>

          {}
          <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
            {(!activeOrder?.cart?.length) ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                <ShoppingCart size={48} />
                <p style={{ fontWeight: '700', marginTop: '12px' }}>Chưa có sản phẩm</p>
              </div>
            ) : (
              activeOrder?.cart?.map(item => (
                <div key={item.variantId} style={{ display: 'flex', gap: '12px', padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '14px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.image.length > 2 ? <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '24px' }}>{item.image}</span>}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.variantId)}
                      style={{ color: '#94a3b8', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      className="hover-red"
                      title="Xóa khỏi đơn hàng"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.2' }}>{item.productName}</div>
                      <div style={{ textAlign: 'right' }}>
                        {item.unitPrice > item.finalPrice && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '2px' }}>
                            {formatMoney(item.unitPrice * item.quantity)}
                          </div>
                        )}
                        <div style={{ fontWeight: '900', fontSize: '15px', color: 'var(--primary)' }}>
                          {formatMoney(item.finalPrice * item.quantity)}
                        </div>
                      </div>
                    </div>

                    {}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '6px 0' }}>
                      {item.attributes?.map((attr, i) => (
                        <span key={i} style={{ fontSize: '10px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', border: '1px solid var(--primary-glow)' }}>
                          {attr.value}
                        </span>
                      ))}
                    </div>

                    {item.unitPrice > item.finalPrice && (
                      <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '900', marginTop: '4px', background: '#fff1f2', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                        <Gift size={12} /> Khuyến mãi: Giảm {item.discountPercent}%
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                        <button onClick={() => updateQty(item.variantId, -1)} className="qty-btn">-</button>
                        <span style={{ fontWeight: '800', fontSize: '13px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.variantId, 1)} className="qty-btn">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {}
          <div style={{ padding: '24px', background: '#f8fafc', borderTop: '1px solid var(--border-strong)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-light)' }}>
                <span>Tạm tính</span>
                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{formatMoney(subtotal - discount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-light)' }}>
                <span>Thuế VAT (10%)</span>
                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{formatMoney(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontWeight: '800', fontSize: '16px' }}>Tổng cộng</span>
                <span style={{ fontWeight: '900', fontSize: '24px', color: 'var(--primary)' }}>{formatMoney(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => { if (totalAmount > 0) { setShowPaymentModal(true); setPaymentSubView(null); } }}
              style={{
                width: '100%',
                padding: '16px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)'
              }}
            >
              <CreditCard size={20} /> Thanh toán
            </button>
          </div>
        </div>
      </div>

    {}
      {showPaymentModal && activeOrder && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: 'white', width: '650px', height: '100vh', maxHeight: '100vh', padding: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
            {}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => paymentSubView ? setPaymentSubView(null) : setShowPaymentModal(false)} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={20} color="#64748b" /></button>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>Thanh toán đơn hàng</h3>
                  <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700' }}>{formatOrderId(activeOrder?.receiptId)}</div>
                </div>
              </div>
              <X size={24} color="#94a3b8" cursor="pointer" onClick={() => setShowPaymentModal(false)} />
            </div>

            {}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '8px' }}>
              {}
              <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignItems: 'flex-start' }}>
                {isAddingCustomer ? (
                  <div style={{ flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Thêm khách hàng mới</div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input type="text" placeholder="Tên khách hàng" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: '600' }} />
                      <input type="text" placeholder="Số điện thoại" value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value.replace(/\D/g, ''))} style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: '600' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setIsAddingCustomer(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#e2e8f0', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>Hủy</button>
                      <button onClick={async () => {
                        if (!newCustomerName || !newCustomerPhone) return;
                        const res = await createNewCustomer(newCustomerName, newCustomerPhone);
                        const cData = res?.data || res;
                        if (cData && cData.customerId) {
                          updateActiveOrder({ customerId: cData.customerId, customerName: cData.fullName, rewardPoints: cData.rewardPoints || 0, pointsToUse: 0 });
                          setCustomerSearch(cData.fullName);
                          setIsAddingCustomer(false);
                          setNewCustomerName('');
                          setNewCustomerPhone('');
                          setShowCustomerDropdown(false);
                        } else {
                          alert("Lỗi khi thêm khách hàng");
                        }
                      }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Lưu khách hàng</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input type="text" placeholder="Tìm khách hàng (tên, sđt)..." value={customerSearch} onChange={(e) => handleSearchCustomer(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '16px', border: '2px solid #f1f5f9', outline: 'none', fontWeight: '600' }} />
                      {showCustomerDropdown && customerResults.length > 0 && (
                        <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                          {customerResults.map(c => (
                            <div key={c.customerId} onClick={() => { updateActiveOrder({ customerId: c.customerId, customerName: c.fullName, rewardPoints: c.rewardPoints || 0, pointsToUse: 0 }); setCustomerSearch(c.fullName); setShowCustomerDropdown(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                              <div style={{ fontWeight: '800' }}>{c.fullName}</div>
                              <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>{c.phoneNumber}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setIsAddingCustomer(true)} style={{ width: '52px', height: '52px', borderRadius: '16px', border: 'none', background: '#f8fafc', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Plus size={24} />
                    </button>
                  </>
                )}
              </div>

              {}
              <div style={{ border: '2px solid #f1f5f9', borderRadius: '24px', padding: '20px', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={28} color="#94a3b8" /></div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '900' }}>{activeOrder?.customerName}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>{activeOrder?.customerId ? 'Khách hàng thân thiết' : 'Khách lẻ'}</div>
                  </div>
                </div>
                {activeOrder?.customerId && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '900' }}>ĐIỂM</div>
                    <div style={{ fontSize: '22px', fontWeight: '950', color: '#10b981' }}>{activeOrder?.rewardPoints || 0}</div>
                  </div>
                )}
              </div>
              {activeOrder?.customerId && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '900', color: '#64748b' }}>TÍCH ĐIỂM</div>
                    <div style={{ fontSize: '22px', fontWeight: '950', color: '#1e293b' }}>+{pointsEarned}</div>
                  </div>
                  <div style={{ background: '#f5f3ff', padding: '14px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '900', color: '#7c3aed' }}>DÙNG ĐIỂM</div>
                      <div
                        onClick={() => {
                          const currentCart = activeOrder?.cart || [];
                          const maxBalance = activeOrder?.rewardPoints || 0;

                          const cartSubtotal = currentCart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                          const cartPromoDiscount = currentCart.reduce((sum, item) => sum + (item.unitPrice - item.finalPrice) * item.quantity, 0);
                          const orderTotalBeforePoints = (cartSubtotal - cartPromoDiscount) * 1.1;

                          const maxByOrder = Math.floor(orderTotalBeforePoints / 1000);
                          const finalMax = Math.min(maxBalance, maxByOrder);

                          updateActiveOrder({ pointsToUse: finalMax });
                        }}
                        style={{ fontSize: '10px', fontWeight: '800', color: '#7c3aed', cursor: 'pointer', background: '#f5f3ff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #ddd6fe' }}
                      >
                        Dùng tối đa
                      </div>
                    </div>
                    <input
                      type="number"
                      value={activeOrder?.pointsToUse || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        const maxBalance = activeOrder?.rewardPoints || 0;

                        const currentCart = activeOrder?.cart || [];
                        const cartSubtotal = currentCart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                        const cartPromoDiscount = currentCart.reduce((sum, item) => sum + (item.unitPrice - item.finalPrice) * item.quantity, 0);
                        const orderTotalBeforePoints = (cartSubtotal - cartPromoDiscount) * 1.1;

                        const maxByOrder = Math.floor(orderTotalBeforePoints / 1000);
                        const finalMax = Math.min(maxBalance, maxByOrder);

                        updateActiveOrder({ pointsToUse: Math.min(val, finalMax) });
                      }}
                      style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '22px', fontWeight: '950', color: '#7c3aed' }}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>

            {}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexShrink: 0 }}>
              <div onClick={() => { setPaymentSubView('cash'); setAmountReceived(formatInputMoney(totalAmount)); }} style={{ padding: '24px', border: paymentSubView === 'cash' ? '2px solid var(--primary)' : '2px solid #f1f5f9', borderRadius: '24px', textAlign: 'center', cursor: 'pointer', background: paymentSubView === 'cash' ? '#eff6ff' : 'transparent' }}>
                <Banknote size={28} color={paymentSubView === 'cash' ? 'var(--primary)' : '#64748b'} style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: '800', color: paymentSubView === 'cash' ? 'var(--primary)' : '#64748b' }}>Tiền mặt</div>
              </div>
              <div onClick={() => { setPaymentSubView('qr'); }} style={{ padding: '24px', border: paymentSubView === 'qr' ? '2px solid var(--primary)' : '2px solid #f1f5f9', borderRadius: '24px', textAlign: 'center', cursor: 'pointer', background: paymentSubView === 'qr' ? '#eff6ff' : 'transparent' }}>
                <QrCode size={28} color={paymentSubView === 'qr' ? 'var(--primary)' : '#64748b'} style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: '800', color: paymentSubView === 'qr' ? 'var(--primary)' : '#64748b' }}>Chuyển khoản</div>
              </div>
            </div>

            {}
            {paymentSubView === 'cash' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexShrink: 0 }}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>SỐ TIỀN KHÁCH ĐƯA</label>
                  <input autoFocus type="text" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "."))} style={{ width: '100%', fontSize: '28px', fontWeight: '950', border: 'none', outline: 'none', background: 'transparent', color: '#1e293b' }} placeholder="0" />
                </div>
                <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '900', color: '#e11d48', display: 'block', marginBottom: '8px' }}>TIỀN TRẢ LẠI KHÁCH</label>
                  <div style={{ fontSize: '28px', fontWeight: '950', color: '#e11d48' }}>
                    {amountReceived ? formatMoney(Math.max(0, parseMoney(amountReceived) - totalAmount)) : '0 đ'}
                  </div>
                </div>
              </div>
            )}
            {paymentSubView === 'qr' && (
              <div style={{
                textAlign: 'center',
                background: 'white',
                padding: '12px',
                borderRadius: '28px',
                border: '1.5px solid #ef4444',
                flexShrink: 0,
                boxShadow: '0 12px 40px rgba(239, 68, 68, 0.12)',
                margin: '10px auto',
                width: '240px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {}
                <div style={{
                  width: '100%',
                  height: '215px',
                  overflow: 'hidden',
                  borderRadius: '16px 16px 0 0'
                }}>
                  <img
                    src={`https://img.vietqr.io/image/MB-088886666-print.png?amount=${totalAmount}&addInfo=${encodeURIComponent(`Thanh toan HD${activeOrder?.receiptId}`)}&accountName=${encodeURIComponent('Chủ POS')}`}
                    alt="qr-top"
                    style={{ width: '100%', display: 'block' }}
                  />
                </div>
                
                {}
                <div style={{
                  width: '100%',
                  height: '40px',
                  overflow: 'hidden',
                  borderRadius: '0 0 16px 16px',
                  position: 'relative'
                }}>
                  <img
                    src={`https://img.vietqr.io/image/MB-088886666-print.png?amount=${totalAmount}&addInfo=${encodeURIComponent(`Thanh toan HD${activeOrder?.receiptId}`)}&accountName=${encodeURIComponent('Chủ POS')}`}
                    alt="qr-bottom"
                    style={{ width: '100%', display: 'block', marginTop: '-295px' }}
                  />
                </div>
              </div>
            )}

            {}
            <div style={{ border: '2px solid #f1f5f9', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{ marginBottom: '16px' }}>
                {activeOrder?.cart?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', marginBottom: '4px' }}>{item.productName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Đơn giá: {formatMoney(item.unitPrice)}</div>
                      {item.unitPrice > item.finalPrice && (
                        <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '800', marginTop: '2px' }}>
                          Khuyến mãi: -{formatMoney(item.unitPrice - item.finalPrice)}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'center', width: '80px' }}>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Số lượng</div>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: '#1e293b' }}>{item.quantity}</div>
                    </div>
                    <div style={{ textAlign: 'right', width: '130px' }}>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Thành tiền</div>
                      <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--primary)', whiteSpace: 'nowrap' }}>{formatMoney(item.finalPrice * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  <span>Tạm tính</span>
                  <span>{formatMoney(subtotal - discount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  <span>Thuế VAT (10%)</span>
                  <span>{formatMoney(tax)}</span>
                </div>
                {pointsDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                    <span>Giảm giá (Điểm tích lũy)</span>
                    <span>- {formatMoney(pointsDiscount)}</span>
                  </div>
                )}
                <div style={{ borderTop: '2px dashed #e2e8f0', margin: '16px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', textTransform: 'uppercase' }}>Tổng thanh toán</span>
                  <span style={{ fontSize: '28px', fontWeight: '950', color: 'var(--primary)' }}>{formatMoney(totalAmount)}</span>
                </div>
              </div>
            </div>

            </div>

          <div style={{ flexShrink: 0 }}>
              <button onClick={handleCompletePayment} style={{ width: '100%', padding: '20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '20px', fontSize: '18px', fontWeight: '950', cursor: 'pointer' }}>HOÀN TẤT GIAO DỊCH</button>
            </div>
          </div>
        </div>
      )}

      {}
      {showReceiptModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px', overflowY: 'auto' }}>
          <div className="modal-content" style={{ background: 'white', borderRadius: '32px', width: '1100px', maxWidth: '100%', minHeight: '80vh', display: 'grid', gridTemplateColumns: '380px 1fr', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.5)', margin: 'auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '48px', textAlign: 'center', color: 'white' }}>
              <div style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}><Check size={48} strokeWidth={3} /></div>
              <h2 style={{ fontSize: '28px', fontWeight: '950', marginBottom: '32px' }}>Thanh toán thành công!</h2>
              <button onClick={() => window.print()} style={{ width: '100%', padding: '18px', background: 'white', color: '#1e3a8a', borderRadius: '16px', fontWeight: '900', marginBottom: '12px' }}>IN HÓA ĐƠN</button>
              <button onClick={finishAll} style={{ width: '100%', padding: '18px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid white', borderRadius: '16px', fontWeight: '800' }}>TẠO ĐƠN MỚI</button>
            </div>
            <div style={{ background: '#f8fafc', padding: '40px 40px 80px 40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', borderLeft: '1px solid #e2e8f0' }}>
              <div id="printable-receipt-content" style={{ background: 'white', width: '480px', padding: '30px', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: '2px solid #0f172a', margin: '20px 0', marginBottom: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{ fontWeight: '950', fontSize: '24px', color: '#0f172a', letterSpacing: '1px', textTransform: 'uppercase' }}>RETAIL STORE</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Hóa đơn thanh toán</div>
                </div>

                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Mã đơn:</span> <span style={{ fontWeight: '700', color: '#0f172a' }}>{formatOrderId(printedReceipt?.receiptId)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Thời gian:</span> <span style={{ fontWeight: '700', color: '#0f172a' }}>{new Date(printedReceipt?.orderAt || Date.now()).toLocaleString('vi-VN')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Nhân viên:</span> <span style={{ fontWeight: '700', color: '#0f172a' }}>{printedReceipt?.staffName || staffName}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Khách hàng:</span> <span style={{ fontWeight: '700', color: '#0f172a' }}>{printedReceipt?.customerName || 'Khách lẻ'}</span></div>
                </div>

                <div style={{ borderTop: '1px dashed #e2e8f0', borderBottom: '1px dashed #e2e8f0', padding: '20px 0', marginBottom: '20px' }}>
                  {printedReceipt?.details.map((item, i) => (
                    <div key={i} style={{ marginBottom: i < (printedReceipt?.details.length - 1) ? '16px' : '0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '900', color: '#0f172a', gap: '10px' }}>
                        <span style={{ flex: 1 }}>{item.productName}</span>
                        <span style={{ whiteSpace: 'nowrap' }}>{formatMoney(item.finalPrice * item.quantity)}</span>
                      </div>

                      {}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px', marginBottom: '4px' }}>
                        {item.attributes?.map((attr, idx) => (
                          <span key={idx} style={{ fontSize: '10px', color: '#475569', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: '700' }}>
                            {attr.value}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                        <div>{item.quantity} x {formatMoney(item.unitPrice)}</div>
                        {item.unitPrice > item.finalPrice && (
                          <div style={{ marginTop: '2px', color: '#ef4444', fontWeight: '900', fontSize: '11px' }}>
                            KM: -{formatMoney((item.unitPrice - item.finalPrice) * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tạm tính:</span> <span style={{ whiteSpace: 'nowrap' }}>{formatMoney((printedReceipt?.paymentBreakdown?.subtotal || 0) - (printedReceipt?.paymentBreakdown?.promoDiscount || 0))}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Thuế VAT (10%):</span> <span style={{ whiteSpace: 'nowrap' }}>{formatMoney(printedReceipt?.paymentBreakdown?.tax || 0)}</span></div>
                  {printedReceipt?.paymentBreakdown?.pointsDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}><span>Giảm giá (Điểm):</span> <span style={{ whiteSpace: 'nowrap' }}>-{formatMoney(printedReceipt?.paymentBreakdown?.pointsDiscount)}</span></div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed #e2e8f0' }}>
                  <span style={{ fontSize: '18px', fontWeight: '950', color: '#0f172a' }}>TỔNG CỘNG:</span>
                  <span style={{ fontSize: '24px', fontWeight: '950', color: '#2563eb', whiteSpace: 'nowrap' }}>{formatMoney(printedReceipt?.paymentBreakdown?.total || 0)}</span>
                </div>

                <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Phương thức TT:</span> <span style={{ fontWeight: '800' }}>{printedReceipt?.paymentMethod}</span></div>

                  {printedReceipt?.paymentMethod === 'Tiền mặt' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tiền khách đưa:</span> <span style={{ fontWeight: '800' }}>{formatMoney(printedReceipt?.amountReceived)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tiền trả lại:</span> <span style={{ fontWeight: '800' }}>{formatMoney(printedReceipt?.amountChange)}</span></div>
                    </>
                  ) : null}

                  {printedReceipt?.pointsEarned > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontWeight: '600' }}>Điểm tích lũy:</span>
                      <span style={{ fontWeight: '800', color: '#10b981' }}>+{printedReceipt.pointsEarned} điểm</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default POSScreen;