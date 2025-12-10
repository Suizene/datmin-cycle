// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      {
        data: config.data,
        params: config.params
      }
    );

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ===============================
// RESPONSE INTERCEPTOR (FIXED)
// ===============================
api.interceptors.response.use(
  (response) => {
    console.log(
      `[API Response] ${response.status} ${response.statusText}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      '[API Response Error]',
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ===============================
// AUTH API
// ===============================
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ===============================
// MOTORCYCLE API
// ===============================
export const motorcycleApi = {
  getAll: () => api.get('/motorcycles'),
  getById: (id) => api.get(`/motorcycles/${id}`),
  create: (data) => api.post('/motorcycles', data),
  update: (id, data) => api.put(`/motorcycles/${id}`, data),
  delete: (id) => api.delete(`/motorcycles/${id}`),

  // Parts (gunakan route yang benar)
  getParts: (motorcycleId) => api.get(`/motorcycles/${motorcycleId}/parts`),
  addPart: (motorcycleId, data) =>
    api.post(`/motorcycles/${motorcycleId}/parts`, data),
  updatePart: (motorcycleId, partId, data) => api.put(`/motorcycles/${motorcycleId}/parts/${partId}`, data),
  deletePart: (motorcycleId, partId) => api.delete(`/motorcycles/${motorcycleId}/parts/${partId}`),
};

// ===============================
// PART API (Opsional)
// ===============================
export const partApi = {
  update: (id, data) => api.put(`/parts/${id}`, data),
};

export default api;
