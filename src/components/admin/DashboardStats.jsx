'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiUserX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        
        const data = await res.json();
        setStats(data.data.stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error(error.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Users Card */}
      <div className="overflow-hidden bg-[var(--container-color-in)] rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-[var(--text-color)] bg-[var(--container-color)] rounded-md">
              <FiUsers className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-[var(--text-color)] truncate">
                Total Users
              </p>
              <p className="text-2xl font-semibold text-[var(--text-color)]">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Users Card */}
      <div className="overflow-hidden bg-[var(--container-color-in)] rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-[var(--text-color)] bg-[var(--container-color)] rounded-md">
              <FiUserCheck className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-[var(--text-color)] truncate">
                Active Users
              </p>
              <p className="text-2xl font-semibold text-[var(--text-color)]">
                {stats.activeUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admins Card */}
      <div className="overflow-hidden bg-[var(--container-color-in)] rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-[var(--text-color)] bg-[var(--container-color)] rounded-md">
              <FiUserX className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-[var(--text-color)] truncate">
                Administrators
              </p>
              <p className="text-2xl font-semibold text-[var(--text-color)]">
                {stats.admins.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="p-6 bg-[var(--container-color-in)] rounded-lg shadow sm:col-span-2 lg:col-span-3">
        <h2 className="text-lg font-medium text-[var(--text-color)]">Recent Activity</h2>
        <div className="mt-4">
          <p className="text-sm text-[var(--text-color)]">
            Recent user activities and system events will be displayed here.
          </p>
          {/* Add your activity feed component here */}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
