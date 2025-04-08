// src/services/api.js
import axios from 'axios';
import { config, initializeConfig } from './config';

// Create a function to get the API instance
export const getApi = async () => {
  // Ensure config is initialized
  await initializeConfig();
  
  // Create an axios instance
  return axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Add a factory for creating API request functions
export const createApiRequest = (method, endpoint) => {
  return async (data, headers = {}) => {
    const api = await getApi();
    
    // Configure the request based on method
    const config = {
      url: endpoint,
      method,
      headers
    };
    
    // Add data based on method type
    if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
      config.data = data;
    } else if (data) {
      config.params = data;
    }
    
    try {
      const response = await api(config);
      return response.data;
    } catch (error) {
      // Handle 401 unauthorized
      if (error.response && error.response.status === 401 && !endpoint.includes('/auth/me')) {
        window.location.href = '/login';
      }
      throw error;
    }
  };
};

// Default export for backward compatibility
const api = {
  get: async (url, params, headers) => {
    const apiInstance = await getApi();
    return apiInstance.get(url, { params, headers });
  },
  post: async (url, data, options) => {
    const apiInstance = await getApi();
    return apiInstance.post(url, data, options);
  },
  put: async (url, data, options) => {
    const apiInstance = await getApi();
    return apiInstance.put(url, data, options);
  },
  delete: async (url, options) => {
    const apiInstance = await getApi();
    return apiInstance.delete(url, options);
  }
};

export default api;