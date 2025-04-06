// src/services/config.js
const getApiUrl = () => {
  // Try getting from window.APP_CONFIG first (dynamically injected)
  if (window.APP_CONFIG && window.APP_CONFIG.apiUrl) {
    return window.APP_CONFIG.apiUrl;
  }
  
  // Fall back to environment variables if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Last resort fallback for development
  console.warn('No API URL configured, using fallback');
  return 'http://localhost:3000';
};

export const config = {
  apiUrl: getApiUrl(),
  region: window.APP_CONFIG?.region || import.meta.env.VITE_AWS_REGION || 'us-east-1',
  resumeBucket: window.APP_CONFIG?.resumeBucket || import.meta.env.VITE_RESUME_BUCKET_NAME,
  jobDescBucket: window.APP_CONFIG?.jobDescBucket || import.meta.env.VITE_JOB_DESC_BUCKET_NAME
};