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
export const getVariantById = (id) => apiClient.get(`/variants/${id}`);

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

export default apiClient;
