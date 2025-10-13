'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiUsers, FiPieChart, FiSettings, FiLogOut, FiHome, FiUser, FiImage, FiAward } from 'react-icons/fi';
import DashboardStats from '@/components/admin/DashboardStats';
import UserManagement from '@/components/admin/UserManagement';
import ProfileManagement from '@/components/admin/ProfileManagement';
import MediaManagement from '@/components/admin/MediaGallery';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import SkillsPage from './skills/page';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      icon: <FiPieChart className="w-3 h-3" />,
      href: '/admin'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <FiUser className="w-3 h-3" />,
      href: '/admin/profile'
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <FiAward className="w-3 h-3" />,
      href: '/admin/skills'
    },
    {
      id: 'users',
      label: 'All Users',
      icon: <FiUsers className="w-3 h-3" />,
      href: '/admin/users'
    },
    {
      id: 'media',
      label: 'Media',
      icon: <FiImage className="w-3 h-3" />,
      href: '/admin/media'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <FiSettings className="w-3 h-3" />,
      href: '/admin/settings'
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--container-color)]">
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Mobile menu button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-[var(--text-color)] hover:bg-[var(--container-color-in)] focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-15'} 
          fixed md:static inset-y-0 left-0 z-30 w-40 transition-transform duration-300 ease-in-out transform bg-[var(--container-color-in)] 
          md:flex md:flex-shrink-0`}>
          <div className="flex flex-col flex-grow pt-1 overflow-y-auto">
            <div className="flex items-center justify-between flex-shrink-0">
              {isSidebarOpen && <p className="text-md font-bold text-[var(--text-color)]">Admin</p>}
              <div className="flex items-center">
                <ThemeToggle />
                <button
                  onClick={toggleSidebar}
                  className="hidden md:block rounded-md text-[var(--text-color)] hover:bg-[var(--container-color)] focus:outline-none"
                  aria-label="Toggle sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isSidebarOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <Link
              href="/"
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-[var(--container-color)] transition-colors duration-200 ${!isSidebarOpen ? 'justify-center' : ''}`}
            >
              <FiHome size={16} className={isSidebarOpen ? 'mr-2' : ''} />
              {isSidebarOpen && 'Visit User Panel'}
            </Link>
            <hr className="mx-2" />
            <div className="flex flex-col flex-grow px-2 mt-2">
              <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      // Close sidebar on mobile when an item is clicked
                      if (window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`flex items-center w-full px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 ${activeTab === item.id
                      ? 'bg-[var(--logo-bg-color)] text-[var(--logo-color)]'
                      : 'text-[var(--text-color)] hover:bg-[var(--container-color)] hover:bg-opacity-75'
                      }`}
                    title={!isSidebarOpen ? item.label : ''}
                  >
                    <div className={`flex items-center ${isSidebarOpen ? 'w-4' : 'w-full justify-center'}`}>
                      {React.cloneElement(item.icon, {
                        className: `${item.icon.props.className} flex-shrink-0`
                      })}
                    </div>
                    {isSidebarOpen && (
                      <span className="ml-3 transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <hr className="mx-2" />
            <div className="py-2 px-2 mt-auto">
              <div className="flex items-center">
                {isSidebarOpen ? (
                  <div className="ml-1 flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--text-color)] truncate">{user.name}</p>
                    <p className="text-xs text-[var(--text-color-light)] truncate">
                      {user.email}
                    </p>
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--logo-bg-color)] flex items-center justify-center text-[var(--logo-color)] font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className={`text-red-600 hover:text-red-800 cursor-pointer ${isSidebarOpen ? 'ml-2' : 'mx-auto'}`}
                  title={isSidebarOpen ? 'Logout' : ''}
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <main className="flex-1 overflow-y-auto focus:outline-none">
            <div className="py-2">
              <div className="px-1 mx-auto max-w-7xl sm:px-6 md:px-8">
                <h1 className="text-lg font-semibold text-[var(--text-color)]">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'profile' && 'Profile Management'}
                  {activeTab === 'skills' && 'Skills Management'}
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'media' && 'Media Management'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
              </div>
              <div className="px-1 mx-auto max-w-7xl sm:px-6 md:px-8">
                <div className="py-2">
                  {activeTab === 'dashboard' && <DashboardStats />}
                  {activeTab === 'profile' && <ProfileManagement />}
                  {activeTab === 'skills' && <SkillsPage />}
                  {activeTab === 'users' && <UserManagement />}
                  {activeTab === 'media' && <MediaManagement />}
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
}
export default AdminDashboard;