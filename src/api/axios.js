// ============================================
// Axios Instance — attaches JWT automatically
// ============================================
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // proxied to http://localhost:5000/api via package.json proxy
});

// Request interceptor: attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;