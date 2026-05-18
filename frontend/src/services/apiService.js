import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const baseService = {
  getAll: () => api.get('/bases'),
  getById: (id) => api.get(`/bases/${id}`),
  create: (data) => api.post('/bases', data),
  update: (id, data) => api.put(`/bases/${id}`, data),
  delete: (id) => api.delete(`/bases/${id}`),
};

export const equipmentService = {
  getAll: () => api.get('/equipment'),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
};

export const purchaseService = {
  getAll: () => api.get('/purchases'),
  getByBase: (baseId) => api.get(`/purchases/base/${baseId}`),
  create: (data) => api.post('/purchases', data),
  getById: (id) => api.get(`/purchases/${id}`),
};

export const transferService = {
  getAll: () => api.get('/transfers'),
  getByBase: (baseId) => api.get(`/transfers/base/${baseId}`),
  create: (data) => api.post('/transfers', data),
  updateStatus: (id, status) => api.put(`/transfers/${id}/status`, { status }),
  getById: (id) => api.get(`/transfers/${id}`),
};

export const assignmentService = {
  getAll: () => api.get('/assignments'),
  getByBase: (baseId) => api.get(`/assignments/base/${baseId}`),
  create: (data) => api.post('/assignments', data),
};

export const expenditureService = {
  getAll: () => api.get('/expenditures'),
  getByBase: (baseId) => api.get(`/expenditures/base/${baseId}`),
  create: (data) => api.post('/expenditures', data),
};

export const inventoryService = {
  getAll: () => api.get('/inventory'),
  getByBase: (baseId) => api.get(`/inventory/base/${baseId}`),
};

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getNetMovement: (baseId) => api.get('/dashboard/net-movement', { params: { baseId } }),
};

export const auditLogService = {
  getAll: (page = 1, limit = 50) => api.get('/audit-logs', { params: { page, limit } }),
  getByUser: (userId) => api.get(`/audit-logs/user/${userId}`),
  getByDateRange: (startDate, endDate) => api.get('/audit-logs/range', { params: { startDate, endDate } }),
};

export default api;
