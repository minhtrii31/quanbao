'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/api';
import {
  login,
  logout,
  getCurrentUser,
  setAuthData,
  clearAuthData
} from '@/lib/api/auth';
import { AUTH_EXPIRED_EVENT } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  const checkAuth = async () => {
    try {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
    } catch {
      clearAuthData();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      clearAuthData();
      setUser(null);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  // Login function
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      setAuthData(response.token || '');
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Session is cleared locally even if the server logout request fails.
    } finally {
      clearAuthData();
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login: handleLogin,
      logout: handleLogout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
