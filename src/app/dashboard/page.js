'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome, {user.name}!
              </h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Profile</h2>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Role:</span> {user.role || 'User'}
                  </p>
                </div>
              </div>
              
              {/* Add more dashboard content here */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                    View Profile
                  </button>
                  <button className="p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                    Edit Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
