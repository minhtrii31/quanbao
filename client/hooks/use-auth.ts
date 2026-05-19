'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Hook for checking if user is authenticated
export const useIsAuthenticated = () => {
  const { user, loading } = useAuth();
  return { isAuthenticated: !!user && !loading, loading };
};

// Hook for protected routes
export const useProtectedRoute = (redirectTo = '/login') => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
};

// Hook for admin routes
export const useAdminRoute = (redirectTo = '/login') => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
      } else if (user.role !== 'admin') {
        router.push('/'); // or unauthorized page
      }
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading, isAdmin: user?.role === 'admin' };
};