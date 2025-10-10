'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiPieChart, FiSettings, FiLogOut, FiHome, FiUser } from 'react-icons/fi';
import DashboardStats from '@/components/admin/DashboardStats';
import UserManagement from '@/components/admin/UserManagement';
import ProfileManagement from '@/components/admin/ProfileManagement';
import { toast } from 'react-hot-toast';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

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

  // Navigation items
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FiPieChart className="w-5 h-5 mr-3" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <FiUser className="w-5 h-5 mr-3" />,
    },
    {
      id: 'users',
      label: 'All Users',
      icon: <FiUsers className="w-5 h-5 mr-3" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <FiSettings className="w-5 h-5 mr-3" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-48">
            <div className="flex flex-col flex-grow pt-1 overflow-y-auto bg-[var(--container-color-in)]">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-lg font-bold text-[var(--text-color)]">Admin Panel </h1>
                <ThemeToggle />
              </div>
              {/* Go to User */}
              <Link href="/" className="block px-2 hover:bg-[var(--container-color)] text-red-600 rounded-md transition-colors duration-200 flex items-center gap-1">
                <FiHome size={16} />
                Visit User Panel
              </Link>
              <hr className="mx-2" />
              <div className="flex flex-col flex-grow px-2 mt-2">
                <nav className="flex-1 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center w-full px-2 py-1 text-sm font-medium rounded-md cursor-pointer ${activeTab === item.id
                        ? 'bg-[var(--logo-bg-color)] text-[var(--logo-color)]'
                        : 'text-[var(--text-color)] hover:bg-[var(--container-color-in)] hover:bg-opacity-75'
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
              <hr className="mx-2" />
              <div className="py-2">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-xs font-medium text-[var(--text-color)]">{user.name}</p>
                    <p className="font-medium text-[var(--text-color)]" style={{ fontSize: '8px' }}>
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-auto text-red-600 hover:text-red-800 cursor-pointer mr-2"
                    title="Logout"
                  >
                    <FiLogOut className="w-7 h-7" />
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
                <h1 className="text-lg font-semibold text-[var(--text-color)]">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'profile' && 'Profile Management'}
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
              </div>
              <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                <div className="py-4">
                  {activeTab === 'dashboard' && <DashboardStats />}
                  {activeTab === 'profile' && <ProfileManagement />}
                  {activeTab === 'users' && <UserManagement />}
                  {activeTab === 'settings' && (
                    <div className="p-6 bg-[var(--container-color-in)] rounded-lg shadow">
                      <h2 className="mb-4 text-lg font-medium">Admin Settings</h2>
                      <p className="text-[var(--text-color)]">
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
