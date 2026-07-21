import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
};

// Interceptor: Now correctly looks for "authToken" based on your local storage
api.interceptors.request.use(
  (config) => {
    // We updated this line to match your exact storage key!
    const token = localStorage.getItem("authToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;