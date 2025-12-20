import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.url?.includes('/admin/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const menuAPI = {
  getAll: () => api.get('/menu'),
  search: (query: string) => api.get(`/menu/search?q=${query}`),
  getByCategory: (category: string) => api.get(`/menu/category/${category}`)
};

export const orderAPI = {
  create: (orderData: any) => api.post('/orders', orderData),
  getAll: () => api.get('/orders')
};

export const reservationAPI = {
  create: (data: any) => api.post('/reservations', data),
  getAll: () => api.get('/reservations')
};

export const paymentAPI = {
  createOrder: (amount: number) => api.post('/payment/create-order', { amount }),
  verify: (data: any) => api.post('/payment/verify', data)
};

export const contactAPI = {
  submit: (data: any) => api.post('/contact', data)
};

export const adminAPI = {
  addMenuItem: (data: any) => api.post('/admin/menu', data),
  updateMenuItem: (id: string, data: any) => api.patch(`/admin/menu/${id}`, data),
  toggleAvailability: (id: string) => api.patch(`/admin/menu/${id}/toggle`),
  updateOrderStatus: (id: string, status: string) => api.patch(`/admin/orders/${id}/status`, { status }),
  updateReservationStatus: (id: string, status: string) => api.patch(`/reservations/${id}/status`, { status }),
  getStats: () => api.get('/admin/stats')
};

export const paytmAPI = {
  initiatePayment: (data: any) => api.post('/paytm/initiate', data),
  verifyPayment: (data: any) => api.post('/paytm/verify', data),
  checkStatus: (orderId: string) => api.get(`/paytm/status/${orderId}`)
};

export default api;
