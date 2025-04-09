// src/services/config.js
import axios from 'axios';

// Fetch API configuration from server-side config endpoint
const fetchApiConfig = async () => {
  try {
    const response = await axios.get('/api');
    console.log('Loaded API configuration:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching API configuration:', error);
    return null;
  }
};

// Get API URL from various sources, prioritizing dynamic config
const getApiUrl = async () => {
  // Try getting from our config endpoint first
  const dynamicConfig = await fetchApiConfig();
  if (dynamicConfig && dynamicConfig.apiEndpoint) {
    console.log('Using dynamically loaded API URL:', dynamicConfig.apiEndpoint);
    return dynamicConfig.apiEndpoint;
  }
  
  // Try getting from window.APP_CONFIG (dynamically injected)
  if (window.APP_CONFIG && window.APP_CONFIG.apiUrl) {
    console.log('Using window.APP_CONFIG API URL');
    return window.APP_CONFIG.apiUrl;
  }
  
  // Fall back to environment variables if available
  if (import.meta.env.VITE_API_URL) {
    console.log('Using environment variable API URL');
    return import.meta.env.VITE_API_URL;
  }
  
  // Last resort fallback for development
  console.warn('No API URL configured, using fallback');
  return 'http://localhost:3000';
};

// Create an initialization promise that can be awaited
let apiConfigPromise = null;

// Initialize config (call this early in app startup)
export const initializeConfig = async () => {
  if (!apiConfigPromise) {
    apiConfigPromise = getApiUrl().then(apiUrl => {
      config.apiUrl = apiUrl;
      console.log('API URL initialized:', apiUrl);
      return config;
    });
  }
  return apiConfigPromise;
};

// Get dynamically loaded API URL (can be called multiple times)
export const getApiEndpoint = async () => {
  // Initialize if not already done
  const currentConfig = await initializeConfig();
  return currentConfig.apiUrl;
};

// Config object that will be populated with the correct values
export const config = {
  apiUrl: null, // Will be populated by initializeConfig
  region: window.APP_CONFIG?.region || import.meta.env.VITE_AWS_REGION || 'us-east-1',
  resumeBucket: window.APP_CONFIG?.resumeBucket || import.meta.env.VITE_RESUME_BUCKET_NAME,
  jobDescBucket: window.APP_CONFIG?.jobDescBucket || import.meta.env.VITE_JOB_DESC_BUCKET_NAME,
  environment: window.APP_CONFIG?.environment || import.meta.env.VITE_ENVIRONMENT || 'development',
  version: window.APP_CONFIG?.version || import.meta.env.VITE_APP_VERSION || '1.0.0'
};