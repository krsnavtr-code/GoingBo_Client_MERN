'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/services/api';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, MapPin, Car, Clock as ClockIcon, AlertCircle } from 'lucide-react';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent('/bookings')}`);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetchAPI('cabs/my-bookings');
        
        if (response && response.status === 'success') {
          setBookings(response.data.bookings || []);
        } else {
          throw new Error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error(error.message || 'Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, router]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't made any bookings yet.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/cabs')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book a Cab
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[var(--container-color)] overflow-hidden shadow rounded-lg border border-[var(--border-color)]"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium">
                      {booking.cab?.name || 'Cab Booking'}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status?.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Pickup</p>
                        <p className="text-sm">{booking.pickupLocation?.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Drop-off</p>
                        <p className="text-sm">{booking.dropoffLocation?.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Date & Time</p>
                        <p className="text-sm">
                          {formatDate(booking.pickupTime)} at {formatTime(booking.pickupTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Car className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Cab Type</p>
                        <p className="text-sm ">
                          {booking.cab?.type || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[var(--border-color)]">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Amount</span>
                        <span className="text-lg font-bold">
                          ${booking.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6 flex justify-end">
                  Call Driver 
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Your Bookings | Cab Booking',
  description: 'View and manage your cab bookings',
};
