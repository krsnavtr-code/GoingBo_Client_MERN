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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-5xl mx-auto bg-[var(--container-color-in)] px-5 py-2 pb-10 rounded-xl"
    >
      <h2 className="text-2xl font-bold mb-6">Find best stay for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            {...register("city", { required: "City is required" })}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Check-in</label>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            minDate={new Date()}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Check-out</label>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            minDate={checkInDate}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium">Rooms</label>
          <select
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value))}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)]"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Room" : "Rooms"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Adults</label>
          <select
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value))}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)] text-sm"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Children</label>
          <select
            value={children}
            onChange={(e) => {
              const count = parseInt(e.target.value);
              setChildren(count);
              setChildrenAges(Array(count).fill(0));
            }}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)] text-sm"
          >
            {[...Array(5)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {children > 0 && (
          <div className="">
            <label className="block text-sm font-medium">Children Ages</label>
            <div className="">
              {childrenAges.map((age, index) => (
                <select
                  key={index}
                  value={age}
                  onChange={(e) => {
                    const newAges = [...childrenAges];
                    newAges[index] = parseInt(e.target.value);
                    setChildrenAges(newAges);
                  }}
                  className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)] text-sm"
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

        <div className="">
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto mt-3 px-3 py-1 border border-transparent rounded-md shadow-sm text-base font-medium text-[var(--button-color)] bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Searching..." : "Find Hotels"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
};

export default HotelSearch;
