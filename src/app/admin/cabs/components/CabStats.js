'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, Car, DollarSign } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CabStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/cabs/stats/cab-stats?timeRange=${timeRange}`, {
        credentials: 'include',
      });
      const data = await response.json();
      setStats(data?.data || null);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const mockStats = {
    totalBookings: 1245,
    totalRevenue: 45230,
    totalCabs: 24,
    availableCabs: 18,
    bookingTrends: [
      { name: 'Mon', bookings: 40 },
      { name: 'Tue', bookings: 30 },
      { name: 'Wed', bookings: 45 },
      { name: 'Thu', bookings: 50 },
      { name: 'Fri', bookings: 65 },
      { name: 'Sat', bookings: 80 },
      { name: 'Sun', bookings: 70 },
    ],
    cabUtilization: [
      { name: 'Economy', value: 45 },
      { name: 'Premium', value: 25 },
      { name: 'SUV', value: 15 },
      { name: 'Luxury', value: 10 },
      { name: 'Minivan', value: 5 },
    ],
    statusDistribution: [
      { name: 'Completed', value: 65 },
      { name: 'In Progress', value: 15 },
      { name: 'Upcoming', value: 12 },
      { name: 'Cancelled', value: 8 },
    ],
    revenueByType: [
      { name: 'Economy', revenue: 15000 },
      { name: 'Premium', revenue: 18000 },
      { name: 'SUV', revenue: 8000 },
      { name: 'Luxury', revenue: 3000 },
      { name: 'Minivan', revenue: 1200 },
    ],
  };

  const displayStats = stats || mockStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cab Analytics</h2>
        <select
          className="border bg-[var(--container-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card */}
        {[
          {
            title: 'Total Bookings',
            value: displayStats?.totalBookings || 0,
            icon: <Calendar className="h-4 w-4 text-gray-500" />,
            change: '+12.5%',
          },
          {
            title: 'Total Revenue',
            value: `$${(displayStats?.totalRevenue || 0).toLocaleString()}`,
            icon: <DollarSign className="h-4 w-4 text-gray-500" />,
            change: '+8.2%',
          },
          {
            title: 'Available Cabs',
            value: `${displayStats?.availableCabs || 0} / ${displayStats?.totalCabs || 0}`,
            icon: <Car className="h-4 w-4 text-gray-500" />,
            change: displayStats?.availableCabs && displayStats?.totalCabs ? `${Math.round((displayStats.availableCabs / displayStats.totalCabs) * 100)}% available` : '0% available',
          },
          {
            title: 'Avg. Booking Value',
            value: `$${(displayStats.totalRevenue / displayStats.totalBookings).toFixed(2)}`,
            icon: <DollarSign className="h-4 w-4 text-gray-500" />,
            change: '+5.3%',
          },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--container-color)] border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">{stat.title}</p>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-[var(--text-color-light)]">
              <span className="text-green-600">{stat.change}</span> from last {timeRange}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Booking Trends */}
        <div className="bg-[var(--container-color)] border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-1">Booking Trends</h3>
          <p className="text-sm text-gray-500 mb-2">Number of bookings over time</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayStats.bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="bookings" name="Bookings" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cab Utilization */}
        <div className="bg-[var(--container-color)] border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-1">Cab Utilization</h3>
          <p className="text-sm text-[var(--text-color-light)] mb-2">Distribution by cab type</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayStats?.cabUtilization || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {(displayStats?.cabUtilization || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Status Distribution */}
        <div className="bg-[var(--container-color)] border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-1">Booking Status</h3>
          <p className="text-sm text-[var(--text-color-light)] mb-2">Distribution by status</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayStats?.statusDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {(displayStats?.statusDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Cab Type */}
        <div className="bg-[var(--container-color)] border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-1">Revenue by Cab Type</h3>
          <p className="text-sm text-[var(--text-color-light)] mb-2">Total revenue distribution</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayStats.revenueByType}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--container-color)] border rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
        <p className="text-sm text-[var(--text-color-light)] mb-4">Latest cab bookings and updates</p>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b last:border-0">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                {item % 2 === 0 ? <Clock className="h-5 w-5" /> : <Car className="h-5 w-5" />}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">
                  {item % 2 === 0 ? 'New Booking' : 'Cab Status Update'}
                </p>
                <p className="text-sm text-[var(--text-color-light)]">
                  {item % 2 === 0
                    ? `New booking #BK${1000 + item} received`
                    : `Cab #CAB${100 + item} is now available`}
                </p>
              </div>
              <div className="ml-auto text-xs text-[var(--text-color-light)]">{item}h ago</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
