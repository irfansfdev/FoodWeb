import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

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