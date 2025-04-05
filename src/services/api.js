// src/services/api.js
import axios from 'axios';

// Use direct URL to Flask backend
const API_URL = 'https://ly5a1b11u9.execute-api.us-east-1.amazonaws.com/prod/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a specific header for non-GET requests
api.interceptors.request.use(function (config) {
  if (config.method !== 'get') {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  return config;
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect on 401 if it's not the /auth/me endpoint
    // This prevents redirect loops when checking auth status
    if (error.response && 
        error.response.status === 401 && 
        !error.config.url.includes('/auth/me')) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;