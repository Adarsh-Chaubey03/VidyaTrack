import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Derive active role from user data (single source of truth)
  const activeRole = user?.activeRole || 'user';

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await apiService.auth.getMe();
          if (response.success) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // ─── Unified login — accepts role for RBAC validation ───
  const login = async (email, password, role = 'user') => {
    try {
      const response = await apiService.auth.login({ email, password, role });

      // Strict triple-check: success flag + token exists + is a string
      const tkn = response?.data?.token;
      if (response?.success === true && typeof tkn === 'string' && tkn.length > 0) {
        const { token: newToken, ...userData } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, message: response.message || 'Login successful' };
      }

      return { success: false, message: response?.message || 'Authentication failed' };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  // ─── Educator login (delegates to unified login with role='educator') ───
  // Kept for backward compatibility (EducatorLogin page)
  const educatorLogin = async (email, password) => {
    return login(email, password, 'educator');
  };

  // ─── Switch from educator back to student mode ──────────
  // With full RBAC, role-switch requires re-authentication.
  // This helper logs out the current session — caller should redirect to login.
  const switchToStudent = async () => {
    logout();
    return { success: true };
  };

  const register = async (name, email, password) => {
    try {
      const response = await apiService.auth.register({ name, email, password });

      const tkn = response?.data?.token;
      if (response?.success === true && typeof tkn === 'string' && tkn.length > 0) {
        const { token: newToken, ...userData } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, message: response.message || 'Registration successful' };
      }

      return { success: false, message: response?.message || 'Registration failed' };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const isEducator = () => {
    return user?.role === 'educator' && user?.educatorApproved === true;
  };

  const isActiveEducator = () => {
    return isEducator() && activeRole === 'educator';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const userId = user?._id || user?.id || null;

  const value = {
    user,
    userId,
    loading,
    activeRole,
    login,
    educatorLogin,
    switchToStudent,
    register,
    logout,
    isAuthenticated,
    isEducator,
    isActiveEducator,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

