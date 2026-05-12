import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5001/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export const getCategories = () => apiClient.get('/categories');
export const getCategoryById = (id) => apiClient.get(`/categories/${id}`);


export const getProducts = (params) => apiClient.get('/products', { params });
export const getProductsWithVariants = (productId) => apiClient.get(`/products/${productId}/variants`);
export const getProductById = (id) => apiClient.get(`/products/${id}`);
export const getVariantById = (id) => apiClient.get(`/products/variants/${id}`);


export const getCustomers = (q) => apiClient.get('/customers', { params: { q } });
export const getCustomerById = (id) => apiClient.get(`/customers/${id}`);
export const createCustomer = (data) => apiClient.post('/customers', data);


export const getOrders = (params) => apiClient.get('/orders', { params });
export const getOrderStats = () => apiClient.get('/orders/stats');
export const createOrder = (data) => apiClient.post('/orders', data);
export const getOrder = (id) => apiClient.get(`/orders/${id}`);
export const updateOrderItems = (id, data) => apiClient.put(`/orders/${id}/items`, data);
export const addOrderItem = (id, data) => apiClient.post(`/orders/${id}/items`, data);
export const deleteOrderItem = (orderId, variantId) => apiClient.delete(`/orders/${orderId}/items/${variantId}`);
export const checkoutOrder = (id, data) => apiClient.patch(`/orders/${id}/checkout`, data);
export const getOrderPrint = (id) => apiClient.get(`/orders/${id}/print`);
export const processReturn = (id, data) => apiClient.patch(`/orders/${id}/return`, data);


export const login = (data) => apiClient.post('/auth/login', data);
export const register = (data) => apiClient.post('/auth/register', data);
export const getStaffInfo = () => apiClient.get('/auth/me');

// Suppliers
export const getSuppliers = (params) => apiClient.get('/suppliers', { params });
export const searchSuppliers = (q) => apiClient.get('/suppliers/search', { params: { q } });
export const getSupplierById = (id) => apiClient.get(`/suppliers/${id}`);
export const createSupplier = (data) => apiClient.post('/suppliers', data);
export const updateSupplier = (id, data) => apiClient.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => apiClient.delete(`/suppliers/${id}`);

// Staff (Admin)
export const getStaffList = (params) => apiClient.get('/staff', { params });
export const createStaff = (data) => apiClient.post('/staff', data);
export const getStaffById = (id) => apiClient.get(`/staff/${id}`);
export const updateStaff = (id, data) => apiClient.put(`/staff/${id}`, data);
export const assignStaffRole = (id, data) => apiClient.put(`/staff/${id}/role`, data);
export const resetStaffPassword = (id, data) => apiClient.put(`/staff/${id}/password`, data);
export const deactivateStaff = (id) => apiClient.put(`/staff/${id}/deactivate`);

// Import/Export Receipts
export const getImportReceipts = (params) => apiClient.get('/import-receipts', { params });
export const getImportReceiptById = (id) => apiClient.get(`/import-receipts/${id}`);
export const createImportReceipt = (data) => apiClient.post('/import-receipts', data);

export const getExportReceipts = (params) => apiClient.get('/export-receipts', { params });
export const getExportReceiptById = (id) => apiClient.get(`/export-receipts/${id}`);
export const createExportReceipt = (data) => apiClient.post('/export-receipts', data);

// Variants
export const searchVariants = (q) => apiClient.get('/variants/search', { params: { q } });
export const createVariant = (data) => apiClient.post('/variants', data);
export const updateVariant = (id, data) => apiClient.put(`/variants/${id}`, data);
export const deleteVariant = (id) => apiClient.delete(`/variants/${id}`);

// Warranty
export const searchWarranty = (q) => apiClient.get('/warranty/search', { params: { q } });
export const getWarrantyHistory = (params) => apiClient.get('/warranty/history', { params });

// Reports
export const getDashboardStats = () => apiClient.get('/reports/dashboard');
export const getRevenueReport = (params) => apiClient.get('/reports/revenue', { params });
export const getRevenueByDate = (date) => apiClient.get(`/reports/revenue/${date}`);
export const getInventoryReport = (params) => apiClient.get('/reports/inventory', { params });
export const getDebtReport = () => apiClient.get('/reports/debt');
export const getDebtDetail = (supplierId) => apiClient.get(`/reports/debt/${supplierId}`);

// Products (missing CRUD)
export const createProduct = (data) => apiClient.post('/products', data);
export const updateProduct = (id, data) => apiClient.put(`/products/${id}`, data);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

// Customers (missing CRUD)
export const getAllCustomers = (params) => apiClient.get('/customers', { params });
export const updateCustomer = (id, data) => apiClient.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => apiClient.delete(`/customers/${id}`);

export default apiClient;
