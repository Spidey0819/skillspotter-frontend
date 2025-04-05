// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("Checking auth status...");
        setLoading(true);
        const response = await api.get('/auth/me');
        console.log("Auth check response:", response.data);
        setCurrentUser(response.data);
      } catch (err) {
        // User is not authenticated or there was an error
        console.log("Auth check failed:", err.response?.status);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log("Attempting login for:", email);
      const response = await api.post('/auth/login', { email, password });
      console.log("Login successful:", response.data);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      console.error("Login failed:", err.response?.data);
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log("Attempting registration for:", email);
      const response = await api.post('/auth/register', { name, email, password });
      console.log("Registration successful:", response.data);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      console.error("Registration failed:", err.response?.data);
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      console.log("Attempting logout");
      await api.post('/auth/logout');
      console.log("Logout API call successful");
    } catch (err) {
      console.error("Logout API call failed:", err);
      // Even if the API call fails, we'll still clear the user state
    } finally {
      // Always clear the user state and session data
      setCurrentUser(null);
      setLoading(false);
      console.log("User state cleared after logout");
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.put('/auth/profile', userData);
      setCurrentUser({...currentUser, ...response.data});
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};