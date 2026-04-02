import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useApi from "../hooks/useApi";

// Create context
const AuthContext = createContext(null);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const api = useApi();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = useCallback(async (email, password) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Set user and auth state for all roles
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      
      const role = response.data.user?.role || 'student';
      const redirectPath = role === 'admin' 
        ? '/admin/dashboard' 
        : role === 'instructor' 
          ? '/instructor/dashboard' 
          : '/';

      return { success: true, redirectPath };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/users/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    checkAuthStatus,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
