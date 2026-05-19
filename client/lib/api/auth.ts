import { apiRequest } from './index';
import { AuthResponse, LoginRequest, User } from '@/types/api';

// Login user
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await apiRequest.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

// Logout user (client-side only)
export const logout = async (): Promise<void> => {
  await apiRequest.post('/auth/logout');
};

// Get current user
export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await apiRequest.get<{ user: User }>('/auth/me');
  return response.data;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return false;
};

// Get stored user data
export const getStoredUser = (): User | null => {
  return null;
};

// Set auth data (after login)
export const setAuthData = (token: string): void => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    if (token) localStorage.setItem('token', token);
  }
};

// Clear auth data (on logout)
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
