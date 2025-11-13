'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HotelRegistrationForm from './HotelRegistrationForm';
import { searchCities } from '@/services/hotelService';

const HotelSearch = ({ onSearch, loading: externalLoading }) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(externalLoading || false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      city: '',
      country: 'IN',
      rooms: 1,
      guests: {
        adults: 2,
        children: 0
      }
    }
  });
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
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isCitySearching, setIsCitySearching] = useState(false);
  
  // Search for cities when city query changes
  useEffect(() => {
    const searchCity = async () => {
      if (cityQuery.length < 2) {
        setCities([]);
        return;
      }
      
      setIsCitySearching(true);
      try {
        const results = await searchCities(cityQuery);
        setCities(results);
      } catch (error) {
        console.error('Error searching cities:', error);
        setCities([]);
      } finally {
        setIsCitySearching(false);
      }
    };

    const timer = setTimeout(searchCity, 500);
    return () => clearTimeout(timer);
  }, [cityQuery]);

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

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCityQuery(`${city.CityName}, ${city.CountryName}`);
    setCities([]);
    
    // Update the form's city field with the city code
    setValue('city', city.CityId, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedCity) {
        throw new Error('Please select a city from the dropdown');
      }

      const searchParams = {
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        city: selectedCity.CityId, // Use the selected city's ID
        country: 'IN', // Default to India
        guests: {
          adults: parseInt(adults) || 2,
          children: parseInt(children) || 0,
          childrenAges: Array.isArray(childrenAges) ? childrenAges.slice(0, children).map(age => parseInt(age) || 0) : []
        },
        rooms: parseInt(rooms) || 1
      };

      console.log('Search params:', searchParams);

      // Call the onSearch prop passed from the parent component
      if (onSearch) {
        const results = await onSearch(searchParams);
        console.log('Search results:', results);
        return results;
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
      <div className="flex justify-between items-center mt-5">
        <h2 className="text-2xl font-bold">Find best stay for you</h2>
        <div>
          <button 
            onClick={() => setShowRegistration(true)}
            className="px-4 py-2 bg-[var(--button-bg-color)] text-[var(--button-color)] rounded-md hover:bg-[var(--button-hover-color)] cursor-pointer"
          >
            Register Your Hotel
          </button>
          {showRegistration && (
            <HotelRegistrationForm onClose={() => setShowRegistration(false)} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              if (!e.target.value) setSelectedCity(null);
            }}
            placeholder="Search for a city..."
            className="block w-full pl-3 pr-10 rounded-md border border-gray-300 shadow-sm py-2 px-3 bg-white text-gray-900"
            required
          />
          {isCitySearching && (
            <div className="absolute right-3 top-8">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            </div>
          )}
          {cities.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {cities.map((city) => (
                <li
                  key={`${city.CityId}-${city.CityName}`}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="flex items-center">
                    <span className="font-normal ml-3 block truncate">
                      {city.CityName}, {city.CountryName} ({city.CityId})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <input
            type="hidden"
            {...register("city", { required: "Please select a city from the dropdown" })}
            value={selectedCity?.Code || ''}
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
