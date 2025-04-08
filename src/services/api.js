// src/services/api.js
import axios from 'axios';
import { config, initializeConfig } from './config';

// Create a function that returns an initialized axios instance
const createApi = async () => {
  try {
    // Ensure config is initialized
    await initializeConfig();

    if (!config.apiUrl) {
      console.error('API URL is not configured properly');
      throw new Error('API URL is not available');
    }

    return axios.create({
      baseURL: config.apiUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error creating API instance:', error);
    throw error;
  }
};

// Factory function for creating API request functions - EXPORT THIS
export const createApiRequest = (method, endpoint) => {
  return async (data, headers = {}) => {
    try {
      const apiInstance = await createApi();

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

      const response = await apiInstance(config);
      return response.data;
    } catch (error) {
      console.error(`API ${method.toUpperCase()} ${endpoint} error:`, error);
      throw error;
    }
  };
};

// Export methods that handle the async nature
const api = {
  get: async (url, params, headers = {}) => {
    try {
      const apiInstance = await createApi();
      const response = await apiInstance.get(url, {
        params,
        headers
      });
      return response;
    } catch (error) {
      console.error(`API GET ${url} error:`, error);
      throw error;
    }
  },

  post: async (url, data, options = {}) => {
    try {
      const apiInstance = await createApi();
      const response = await apiInstance.post(url, data, options);
      return response;
    } catch (error) {
      console.error(`API POST ${url} error:`, error);
      throw error;
    }
  },

  put: async (url, data, options = {}) => {
    try {
      const apiInstance = await createApi();
      const response = await apiInstance.put(url, data, options);
      return response;
    } catch (error) {
      console.error(`API PUT ${url} error:`, error);
      throw error;
    }
  },

  delete: async (url, options = {}) => {
    try {
      const apiInstance = await createApi();
      const response = await apiInstance.delete(url, options);
      return response;
    } catch (error) {
      console.error(`API DELETE ${url} error:`, error);
      throw error;
    }
  }
};

// Add a response interceptor to handle common errors
if (typeof window !== 'undefined') {
  axios.interceptors.response.use(
      response => response,
      error => {
        // Only redirect on 401 if it's not the /auth/me endpoint
        if (error.response &&
            error.response.status === 401 &&
            !error.config.url.includes('/auth/me')) {
          // Redirect to login if unauthorized
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
  );
}

export default api;