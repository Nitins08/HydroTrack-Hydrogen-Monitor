import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token from localStorage if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('hydrotrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: handle 401 unauthorized
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired, but do not redirect if already on login/signup
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.removeItem('hydrotrack_token');
        localStorage.removeItem('hydrotrack_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication
  login: (credentials) =>
    client.post('/auth/login', credentials).then((res) => res.data),

  signup: (userData) =>
    client.post('/auth/signup', userData).then((res) => res.data),

  getMe: () =>
    client.get('/auth/me').then((res) => res.data),

  // Readings
  getReadings: (period = '30d') => 
    client.get(`/readings?period=${period}`).then((res) => res.data),
  
  addReading: (readingData) => 
    client.post('/readings', readingData).then((res) => res.data),

  updateReading: (id, readingData) =>
    client.put(`/readings/${id}`, readingData).then((res) => res.data),

  deleteReading: (id) =>
    client.delete(`/readings/${id}`).then((res) => res.data),

  // Dashboard
  getDashboard: (period = '30d') => 
    client.get(`/dashboard?period=${period}`).then((res) => res.data),

  // Analytics
  getAnalytics: (period = '30d') => 
    client.get(`/analytics?period=${period}`).then((res) => res.data),

  // Sustainability
  getSustainability: (period = '30d') => 
    client.get(`/sustainability?period=${period}`).then((res) => res.data),

  // Admin Management
  adminGetUsers: () =>
    client.get('/admin/users').then((res) => res.data),

  adminUpdateUserRole: (id, role) =>
    client.patch(`/admin/users/${id}/role`, { role }).then((res) => res.data),

  adminDeleteUser: (id) =>
    client.delete(`/admin/users/${id}`).then((res) => res.data)
};

export default api;
