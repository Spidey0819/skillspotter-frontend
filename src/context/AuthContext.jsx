// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/auth';
import { initializeConfig } from '../services/config';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Initialize API configuration
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeConfig();
        setInitialized(true);
      } catch (err) {
        console.error('Failed to initialize API configuration:', err);
        setError('Failed to connect to the server. Please try again later.');
      }
    };

    initialize();
  }, []);

  // Load user data on mount and when token changes
  const loadUser = useCallback(async () => {
    // Don't attempt to load user until API is initialized
    if (!initialized) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token means not authenticated
        setUser(null);
        setLoading(false);
        return;
      }

      // Get current user from API
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error('Failed to load user:', err);
      
      // Clear invalid tokens
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
      }
      
      setUser(null);
      setError('Authentication failed. Please log in again.');
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // Load user when component mounts and when initialized changes
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure config is initialized
      if (!initialized) {
        await initializeConfig();
        setInitialized(true);
      }

      const result = await loginUser(email, password);
      
      // Store token
      if (result && result.token) {
        localStorage.setItem('token', result.token);
        setUser(result);
      } else {
        throw new Error('Authentication failed. No token received.');
      }
      
      return result;
    } catch (err) {
      console.error('Login error:', err);
      
      const errorMessage = err.response?.data?.error || 
                          'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure config is initialized
      if (!initialized) {
        await initializeConfig();
        setInitialized(true);
      }

      const result = await registerUser(name, email, password);
      
      // Store token
      if (result && result.token) {
        localStorage.setItem('token', result.token);
        setUser(result);
      } else {
        throw new Error('Registration failed. No token received.');
      }
      
      return result;
    } catch (err) {
      console.error('Registration error:', err);
      
      const errorMessage = err.response?.data?.error || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if server logout fails, clear local state
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  // Refresh user data
  const refreshUser = async () => {
    await loadUser();
  };

  // Context value
  const contextValue = {
    user,
    loading,
    error,
    initialized,
    login,
    register,
    logout,
    isAuthenticated,
    refreshUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};