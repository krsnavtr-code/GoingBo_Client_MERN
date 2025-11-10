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
    const checkAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (response && response.status === "success" && response.data) {
          console.log("User authenticated:", response.data.user);
          setUser(response.data.user);
        } else {
          console.log("No active session or invalid response");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Only clear user if it's an actual auth error (401)
        if (error.status === 401) {
          setUser(null);
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
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response && response.status === 'success' && response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true };
      }
      throw new Error('Failed to update profile');
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update profile. Please try again.' 
      };
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
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
