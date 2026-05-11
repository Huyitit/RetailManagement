import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response;
};

export const searchCustomers = async (keyword) => {
  const response = await api.get(`/customers?q=${encodeURIComponent(keyword)}`);
  return response;
};

const createDraftOrder = async (staffId, customerId) => {
  const response = await apiCall('/orders', { method: 'POST', body: JSON.stringify({ staffId, customerId }) });
  return response.data;
};

export const addOrderItem = async (receiptId, variantId, quantity) => {
  const response = await api.post(`/orders/${receiptId}/items`, { variantId, quantity });
  return response.data;
};

export const updateOrderItem = async (receiptId, variantId, quantity) => {
  const response = await api.put(`/orders/${receiptId}/items`, { variantId, quantity });
  return response.data;
};

export const deleteOrderItem = async (receiptId, variantId) => {
  const response = await api.delete(`/orders/${receiptId}/items/${variantId}`);
  return response.data;
};

export const checkoutOrder = async (receiptId, paymentData) => {
  const response = await api.patch(`/orders/${receiptId}/checkout`, paymentData);
  return response.data;
};

export const getOrderPrint = async (receiptId) => {
  const response = await api.get(`/orders/${receiptId}/print`);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response;
};