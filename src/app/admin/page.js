'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import DashboardStats from '@/components/admin/DashboardStats';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, contactsRes] = await Promise.all([
          axios.get('/api/v1/admin/dashboard'),
          axios.get('/api/v1/admin/contacts/stats')
        ]);

        setStats({
          users: usersRes.data.data.stats,
          contacts: contactsRes.data.data.stats
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-[var(--text-color-light)]">
          Welcome to your admin dashboard. Here&apos;s what&apos;s happening with your site.
        </p>
      </div>

      <DashboardStats stats={stats} />
    </div>
  );
}
