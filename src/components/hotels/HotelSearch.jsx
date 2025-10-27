'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const HotelSearch = ({ onSearch, loading: externalLoading }) => {
  const [loading, setLoading] = useState(externalLoading || false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  });
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState(Array(children).fill(0));
  
  // Update childrenAges when children count changes
  useEffect(() => {
    setChildrenAges(prev => {
      const newAges = [...prev];
      while (newAges.length < children) {
        newAges.push(0);
      }
      return newAges.slice(0, children);
    });
  }, [children]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = {
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        city: data.city,
        country: data.country || 'IN',
        guests: {
          adults,
          children,
          childrenAges: childrenAges.slice(0, children)
        },
        rooms
      };

      // Call the onSearch prop passed from the parent component
      if (onSearch) {
        await onSearch(searchParams);
      }
    } catch (err) {
      setError(err.message || 'Failed to search hotels');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Search Hotels</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check-in
            </label>
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              minDate={new Date()}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check-out
            </label>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              minDate={checkInDate}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rooms
              </label>
              <select
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Room" : "Rooms"}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600">Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600">Children</label>
                <select
                  value={children}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    setChildren(count);
                    setChildrenAges(Array(count).fill(0));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  {[...Array(5)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {children > 0 && (
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Children Ages
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {childrenAges.map((age, index) => (
                    <select
                      key={index}
                      value={age}
                      onChange={(e) => {
                        const newAges = [...childrenAges];
                        newAges[index] = parseInt(e.target.value);
                        setChildrenAges(newAges);
                      }}
                      className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {[...Array(18)].map((_, i) => (
                        <option key={i} value={i}>
                          {i} {i === 1 ? "year" : "years"}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Hotels"}
          </button>
        </div>

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default HotelSearch;
