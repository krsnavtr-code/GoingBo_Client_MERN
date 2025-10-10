'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUsers, FiPieChart, FiSettings, FiLogOut } from 'react-icons/fi';
import DashboardStats from '@/components/admin/DashboardStats';
import UserManagement from '@/components/admin/UserManagement';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/v1/users/me', {
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Not authorized');
        }
        
        const data = await res.json();
        
        if (data.data.user.role !== 'admin') {
          throw new Error('Access denied. Admins only.');
        }
        
        setUser(data.data.user);
      } catch (error) {
        toast.error(error.message || 'Please log in as admin');
        router.push('/login');
      }
    };
    
    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/v1/users/logout', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (res.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex h-screen overflow-hidden bg-white">
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-indigo-700">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              </div>
              <div className="flex flex-col flex-grow px-4 mt-5">
                <nav className="flex-1 space-y-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'dashboard'
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75'
                    }`}
                  >
                    <FiPieChart className="w-5 h-5 mr-3" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'users'
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75'
                    }`}
                  >
                    <FiUsers className="w-5 h-5 mr-3" />
                    Users
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'settings'
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75'
                    }`}
                  >
                    <FiSettings className="w-5 h-5 mr-3" />
                    Settings
                  </button>
                </nav>
              </div>
              <div className="p-4 border-t border-indigo-800">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs font-medium text-indigo-200">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-auto text-indigo-200 hover:text-white"
                    title="Logout"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
              </div>
              <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                <div className="py-4">
                  {activeTab === 'dashboard' && <DashboardStats />}
                  {activeTab === 'users' && <UserManagement />}
                  {activeTab === 'settings' && (
                    <div className="p-6 bg-white rounded-lg shadow">
                      <h2 className="mb-4 text-lg font-medium">Admin Settings</h2>
                      <p className="text-gray-600">
                        Settings content will go here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
