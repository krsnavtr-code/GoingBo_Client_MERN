'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarDays, Users, PlaneTakeoff, PlaneLanding, X, Search } from 'lucide-react';
import { searchAirports, getAirportByCode } from '@/utils/airportData';

export default function FlightSearch({ onSearch, loading, initialValues = {} }) {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: {
      tripType: 'oneway',
      cabinClass: 'Economy',
      adults: 1,
      children: 0,
      infants: 0,
      ...initialValues
    }
  });

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  const tripType = watch('tripType');
  const cabinClass = watch('cabinClass');

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle origin input change
  const handleOriginChange = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      const results = searchAirports(value);
      setOriginSuggestions(results);
      setShowOriginSuggestions(true);
    } else {
      setOriginSuggestions([]);
      setShowOriginSuggestions(false);
      setSelectedOrigin(null);
    }
  };

  // Handle destination input change
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      const results = searchAirports(value);
      setDestinationSuggestions(results);
      setShowDestinationSuggestions(true);
    } else {
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
      setSelectedDestination(null);
    }
  };

  // Handle selecting an origin
  const selectOrigin = (airport) => {
    setSelectedOrigin(airport);
    setValue('origin', airport.code);
    setShowOriginSuggestions(false);
  };

  // Handle selecting a destination
  const selectDestination = (airport) => {
    setSelectedDestination(airport);
    setValue('destination', airport.code);
    setShowDestinationSuggestions(false);
  };

  // Swap origin and destination
  const swapLocations = () => {
    const temp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(temp);
    setValue('origin', selectedDestination?.code || '');
    setValue('destination', selectedOrigin?.code || '');
  };

  const onSubmit = (data) => {
    // Format the data for the API
    const searchData = {
      origin: data.origin,
      destination: data.destination,
      departureDate: data.departureDate,
      tripType: data.tripType,
      adults: parseInt(data.adults) || 1,
      children: parseInt(data.children) || 0,
      infants: parseInt(data.infants) || 0,
      cabinClass: data.cabinClass
    };

    if (data.tripType === 'roundtrip' && data.returnDate) {
      searchData.returnDate = data.returnDate;
    }

    console.log('Submitting search:', searchData);
    onSearch(searchData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Trip Type Toggle */}
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-md ${tripType === 'oneway' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setValue('tripType', 'oneway')}
        >
          One Way
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md ${tripType === 'roundtrip' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setValue('tripType', 'roundtrip')}
        >
          Round Trip
        </button>
      </div>

      {/* Origin and Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative" ref={originRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="relative">
            <PlaneTakeoff className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City or Airport"
              onChange={handleOriginChange}
              value={selectedOrigin ? `${selectedOrigin.city} (${selectedOrigin.code})` : ''}
            />
            {selectedOrigin && (
              <button
                type="button"
                onClick={() => {
                  setSelectedOrigin(null);
                  setValue('origin', '');
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
              {originSuggestions.map((airport) => (
                <div
                  key={`${airport.code}-${airport.name}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedOrigin(airport);
                    setValue('origin', airport.code);
                    setShowOriginSuggestions(false);
                  }}
                >
                  <div className="font-medium">{airport.city} ({airport.code})</div>
                  <div className="text-sm text-gray-500">{airport.name}</div>
                </div>
              ))}
            </div>
          )}
          <input type="hidden" {...register('origin', { required: 'Origin is required' })} />
          {errors.origin && <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>}
        </div>

        <div className="relative" ref={destinationRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <div className="relative">
            <PlaneLanding className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City or Airport"
              onChange={handleDestinationChange}
              value={selectedDestination ? `${selectedDestination.city} (${selectedDestination.code})` : ''}
            />
            {selectedDestination && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDestination(null);
                  setValue('destination', '');
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
              {destinationSuggestions.map((airport) => (
                <div
                  key={`${airport.code}-${airport.name}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedDestination(airport);
                    setValue('destination', airport.code);
                    setShowDestinationSuggestions(false);
                  }}
                >
                  <div className="font-medium">{airport.city} ({airport.code})</div>
                  <div className="text-sm text-gray-500">{airport.name}</div>
                </div>
              ))}
            </div>
          )}
          <input type="hidden" {...register('destination', { required: 'Destination is required' })} />
          {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('departureDate', { required: 'Departure date is required' })}
            />
          </div>
          {errors.departureDate && <p className="mt-1 text-sm text-red-600">{errors.departureDate.message}</p>}
        </div>

        <div className={tripType === 'oneway' ? 'opacity-50' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              min={watch('departureDate') || new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={tripType === 'oneway'}
              {...register('returnDate', {
                required: tripType === 'roundtrip' ? 'Return date is required' : false,
                validate: (value) => {
                  if (tripType === 'roundtrip' && value && watch('departureDate') && new Date(value) < new Date(watch('departureDate'))) {
                    return 'Return date must be after departure date';
                  }
                  return true;
                }
              })}
            />
          </div>
          {errors.returnDate && <p className="mt-1 text-sm text-red-600">{errors.returnDate.message}</p>}
        </div>
      </div>

      {/* Passengers and Cabin Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('adults', { valueAsNumber: true, min: 1, max: 9 })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('children', { valueAsNumber: true, min: 0, max: 8 })}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Infants</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('infants', { valueAsNumber: true, min: 0, max: 8 })}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Infant' : 'Infants'}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Class</label>
          <div className="relative">
            <select
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('cabinClass')}
            >
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First">First Class</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Search Flights
            </>
          )}
        </button>
      </div>
    </form>
  );
}
