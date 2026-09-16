import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Readings
  getReadings: (period = '30d') => 
    client.get(`/readings?period=${period}`).then((res) => res.data),
  
  addReading: (readingData) => 
    client.post('/readings', readingData).then((res) => res.data),

  // Dashboard
  getDashboard: (period = '30d') => 
    client.get(`/dashboard?period=${period}`).then((res) => res.data),

  // Analytics
  getAnalytics: (period = '30d') => 
    client.get(`/analytics?period=${period}`).then((res) => res.data),

  // Sustainability
  getSustainability: (period = '30d') => 
    client.get(`/sustainability?period=${period}`).then((res) => res.data)
};

export default api;
