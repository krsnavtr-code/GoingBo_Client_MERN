'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const response = await authAPI.getCurrentUser();
        console.log('Current user data:', response);
        
        // Check the response structure and extract user data
        if (response && response.status === 'success' && response.data && response.data.user) {
          console.log('Setting user data:', response.data.user);
          setUser(response.data.user);
        } else {
          console.log('No valid user data received');
          setUser(null);
        }
      } catch (error) {
        // 401 is expected when not logged in
        if (error.status === 401) {
          console.log('User not authenticated');
          setUser(null);
        } else {
          console.error('Auth check error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      // Check the response structure and extract user data
      if (response && response.status === 'success' && response.data && response.data.user) {
        console.log('Setting user data after login:', response.data.user);
        setUser(response.data.user);
        return { success: true };
      } else {
        console.error('Unexpected login response format:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to login. Please try again.' 
      };
    }
  };

  const signup = async (name, email, password, passwordConfirm) => {
    try {
      const response = await authAPI.signup(name, email, password, passwordConfirm);
      console.log('Signup response:', response);
      
      if (response && response.status === 'success' && response.data && response.data.user) {
        console.log('Setting user data after signup:', response.data.user);
        setUser(response.data.user);
        return { success: true };
      } else {
        console.error('Unexpected signup response format:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign up. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
