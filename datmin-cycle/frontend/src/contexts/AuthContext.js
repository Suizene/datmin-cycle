// src/contexts/AuthContext.js
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper untuk set token di axios & localStorage
  const setAuthToken = useCallback((token) => {
    if (token) {
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      axios.defaults.headers.common['Authorization'] = formattedToken;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, []);

  // Ambil profile user
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/auth/profile`);
      setCurrentUser(data);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error.response?.data || error.message);
      setAuthToken(null);
      setCurrentUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuthToken]);

  // Load user saat mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      // Don't wait for fetch to complete before showing content
      fetchUser().catch(() => {
        // Handle error silently
      });
    }
    // Set loading to false immediately to prevent spinner
    setLoading(false);
  }, [fetchUser, setAuthToken]);

  // Login
  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      setAuthToken(data.token);
      await fetchUser(); // Pastikan user data ter-update
      return data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        'Gagal login. Periksa email dan password Anda.'
      );
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/register`, { 
        name, 
        email, 
        password 
      });
      setAuthToken(data.token);
      await fetchUser(); // Pastikan user data ter-update
      return data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        'Gagal register. Periksa input Anda.'
      );
    }
  };

  // Logout
  const logout = useCallback(() => {
    setAuthToken(null);
    setCurrentUser(null);
  }, [setAuthToken]);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    refreshUser: fetchUser // Export fetchUser untuk refresh data user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};