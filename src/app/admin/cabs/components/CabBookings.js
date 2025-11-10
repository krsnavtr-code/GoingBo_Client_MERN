'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, User, Car, Search, ArrowUpDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  driver_assigned: 'bg-indigo-100 text-indigo-800',
  driver_en_route: 'bg-purple-100 text-purple-800',
  arrived: 'bg-pink-100 text-pink-800',
  in_progress: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-gray-100 text-gray-800',
};

export default function CabBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'pickupTime', direction: 'desc' });
  const [cabs, setCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState('all');

  const router = useRouter();

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/cabs/bookings`, {
        credentials: 'include',
      });
      const data = await response.json();
      setBookings(data.data?.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCabs = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/cabs`, {
        credentials: 'include',
      });
      const data = await response.json();
      setCabs(data.data?.cabs || []);
    } catch (error) {
      console.error('Error fetching cabs:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchCabs();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await fetch(`${API_URL}/admin/cabs/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
      alert('Booking status updated successfully.');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update booking status.');
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBookings = sortedBookings.filter((b) => {
    const matchesSearch =
      b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingReference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesCab = selectedCab === 'all' || b.cab?._id === selectedCab;
    return matchesSearch && matchesStatus && matchesCab;
  });

  const getStatusBadge = (status) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );

  const getNextStatus = (currentStatus) => {
    const flow = ['pending', 'confirmed', 'driver_assigned', 'driver_en_route', 'arrived', 'in_progress', 'completed'];
    const i = flow.indexOf(currentStatus);
    return i < flow.length - 1 ? flow[i + 1] : null;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cab Bookings</h2>
      </div>

      <div className="bg-[var(--container-color)] shadow rounded-lg border">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Manage Bookings</h3>
            <p className="text-sm text-[var(--text-color-light)]">View and manage all cab bookings</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search bookings..."
                className="w-full pl-8 pr-2 py-2 border bg-[var(--container-color-in)] rounded-md focus:ring-2 focus:ring-[var(--container-color-in)] text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="border bg-[var(--container-color-in)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--container-color-in)]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {Object.keys(statusColors).map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>

            <select
              className="border bg-[var(--container-color-in)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--container-color-in)]"
              value={selectedCab}
              onChange={(e) => setSelectedCab(e.target.value)}
            >
              <option value="all">All Cabs</option>
              {cabs.map(cab => (
                <option key={cab._id} value={cab._id}>{cab.name} ({cab.registrationNumber})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-10 text-[var(--text-color-light)]">No bookings found.</div>
          ) : (
            <table className="w-full text-sm border-t">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'bookingReference', label: 'Booking ID' },
                    { key: 'user', label: 'Customer' },
                    { key: 'pickupTime', label: 'Pickup Time' },
                    { key: 'route', label: 'Route' },
                    { key: 'cab', label: 'Cab' },
                    { key: 'status', label: 'Status' },
                    { key: 'actions', label: 'Actions' },
                  ].map((col, i) => (
                    <th
                      key={i}
                      className={`p-3 text-left font-medium text-[var(--text-color-light)] ${col.key !== 'actions' ? 'cursor-pointer' : ''}`}
                      onClick={col.key !== 'actions' ? () => handleSort(col.key) : undefined}
                    >
                      <div className="flex items-center">
                        {col.label}
                        {col.key !== 'actions' && <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-gray-400" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((b) => {
                  const nextStatus = getNextStatus(b.status);
                  return (
                    <tr key={b._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{b.bookingReference}</td>
                      <td className="p-3 flex items-center gap-2"><User className="h-4 w-4 text-gray-400" />{b.user?.name || 'N/A'}</td>
                      <td className="p-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {format(parseISO(b.pickupTime), 'MMM d, yyyy')}
                        <Clock className="h-4 w-4 ml-2 text-gray-400" />
                        {format(parseISO(b.pickupTime), 'h:mm a')}
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="flex items-center gap-1 text-green-600"><MapPin className="h-4 w-4" />{b.pickupLocation?.address}</div>
                          <div className="flex items-center gap-1 text-red-600"><MapPin className="h-4 w-4" />{b.dropoffLocation?.address}</div>
                        </div>
                      </td>
                      <td className="p-3">{b.cab ? `${b.cab.name} (${b.cab.registrationNumber})` : 'N/A'}</td>
                      <td className="p-3">{getStatusBadge(b.status)}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
                          onClick={() => router.push(`/admin/cabs/bookings/${b._id}`)}
                        >
                          View
                        </button>
                        {nextStatus && (
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                            onClick={() => handleStatusUpdate(b._id, nextStatus)}
                          >
                            {nextStatus === 'completed' ? 'Complete' : `Mark as ${nextStatus.replace('_', ' ')}`}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
