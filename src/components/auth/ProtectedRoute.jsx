'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, requireAuth = true, redirectTo = '/login' }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // If route requires auth but user is not logged in, redirect to login
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        // If route is auth-related (like login/signup) but user is already logged in, redirect to home
        router.push('/');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading || (requireAuth && !user) || (!requireAuth && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
}
