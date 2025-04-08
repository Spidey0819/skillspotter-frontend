// src/services/auth.js
import api from './api';

// Login user
export const loginUser = async (email, password) => {
  try {
    const apiInstance = await api.get;
    const response = await apiInstance.post('/auth/login', { email, password });
    
    // Store token if provided
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register user
export const registerUser = async (name, email, password) => {
  try {
    const apiInstance = await api.get;
    const response = await apiInstance.post('/auth/register', { name, email, password });
    
    // Store token if provided
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    // Remove token from local storage first (most important)
    localStorage.removeItem('token');
    
    // Try to notify server but don't fail if this doesn't work
    try {
      const apiInstance = await api.get;
      const response = await apiInstance.post('/auth/logout');
      return response.data;
    } catch (err) {
      // If API call fails, still consider logout successful
      console.log('API logout failed, but local logout succeeded');
      return { success: true };
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    // Get token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Make API call with token
    const apiInstance = await api.get;
    const response = await apiInstance.get('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const apiInstance = await api.get;
    const response = await apiInstance.put('/auth/profile', userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const apiInstance = await api.get;
    const response = await apiInstance.put('/auth/change-password', { 
      currentPassword, 
      newPassword 
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};