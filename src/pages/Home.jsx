'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--container-color)] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
        {user 
          ? `Welcome back, ${user.name || 'User'}!` 
          : 'Welcome to My Portfolio'}
      </h1>
      {!user && (
        <p className="text-lg text-gray-600 text-center">
          Please log in to access your dashboard
        </p>
      )}
    </div>
  );
}