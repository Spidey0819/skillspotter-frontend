// src/services/auth.js
import api from './api';

// Login user
export const loginUser = async (email, password) => {
  try {
    console.log('Attempting to login with:', { email });
    const response = await api.post('/auth/login', { email, password });

    // Store token if provided
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Login successful, token stored');
    } else {
      console.warn('Login response missing token:', response.data);
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
    console.log('Attempting to register user:', { name, email });
    const response = await api.post('/auth/register', { name, email, password });

    // Store token if provided
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Registration successful, token stored');
    } else {
      console.warn('Registration response missing token:', response.data);
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
    console.log('Logging out user');

    // Try to call the API if it exists (but handle gracefully if it fails)
    try {
      const response = await api.post('/auth/logout');
      console.log('Server logout successful');
      localStorage.removeItem('token');
      return response.data;
    } catch (apiError) {
      console.warn('API logout failed, proceeding with local logout', apiError);
      localStorage.removeItem('token');
      return { success: true };
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, still remove the token
    localStorage.removeItem('token');
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    console.log('Fetching current user data');
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('No authentication token found');
      throw new Error('No authentication token found');
    }

    const response = await api.get('/auth/me', null, {
      'Authorization': `Bearer ${token}`
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
    console.log('Updating user profile');
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.put('/auth/profile', userData, {
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
    console.log('Changing password');
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.put('/auth/change-password', {
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