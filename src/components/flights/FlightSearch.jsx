'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarDays, Users, PlaneTakeoff, PlaneLanding, X, Search } from 'lucide-react';
import { searchAirports, getAirportByCode } from '@/utils/airportData';

export default function FlightSearch({ onSearch, loading }) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [tripType, setTripType] = useState('oneway');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

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
    const searchParams = {
      origin: data.origin,
      destination: data.destination,
      departure_date: data.departureDate,
      return_date: tripType === 'roundtrip' ? data.returnDate : undefined,
      adults: parseInt(data.adults) || 1,
      children: parseInt(data.children) || 0,
      infants: parseInt(data.infants) || 0,
      cabin_class: cabinClass,
      non_stop: data.nonStop || false
    };
    
    onSearch(searchParams);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-[var(--container-color-in)] px-5 py-2 rounded-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="col-span-3">
          <label className="block text-sm font-medium mb-1">Trip Type</label>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md cursor-pointer ${
                tripType === "oneway"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setTripType("oneway")}
            >
              One Way
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md cursor-pointer ${
                tripType === "roundtrip"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setTripType("roundtrip")}
            >
              Round Trip
            </button>
          </div>
        </div>
      </div>

      {/* Origin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative" ref={originRef}>
          <label htmlFor="origin" className="block text-sm font-medium mb-1">
            From
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PlaneTakeoff className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="origin"
              type="text"
              {...register("origin", {
                required: "Origin is required",
                onChange: handleOriginChange,
              })}
              className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)]"
              placeholder="City or Airport"
              autoComplete="off"
              value={
                selectedOrigin
                  ? `${selectedOrigin.city} (${selectedOrigin.code})`
                  : ""
              }
            />
            {selectedOrigin && (
              <button
                type="button"
                onClick={() => {
                  setSelectedOrigin(null);
                  setValue("origin", "");
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
              {originSuggestions.map((airport) => (
                <div
                  key={airport.code}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => selectOrigin(airport)}
                >
                  <div className="flex-shrink-0 w-10 font-mono font-bold text-blue-600">
                    {airport.code}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {airport.city}
                    </div>
                    <div className="text-xs text-gray-500">{airport.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.origin && (
            <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>
          )}
        </div>

        <div className="relative" ref={destinationRef}>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="destination" className="block text-sm font-medium">
              To
            </label>
            <button
              type="button"
              onClick={swapLocations}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              title="Swap origin and destination"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Swap
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PlaneLanding className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="destination"
              type="text"
              {...register("destination", {
                required: "Destination is required",
                onChange: handleDestinationChange,
              })}
              className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)]"
              placeholder="City or Airport"
              autoComplete="off"
              value={
                selectedDestination
                  ? `${selectedDestination.city} (${selectedDestination.code})`
                  : ""
              }
            />
            {selectedDestination && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDestination(null);
                  setValue("destination", "");
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
              {destinationSuggestions.map((airport) => (
                <div
                  key={airport.code}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => selectDestination(airport)}
                >
                  <div className="flex-shrink-0 w-10 font-mono font-bold text-blue-600">
                    {airport.code}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {airport.city}
                    </div>
                    <div className="text-xs text-gray-500">{airport.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.destination && (
            <p className="mt-1 text-sm text-red-600">
              {errors.destination.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="departureDate"
            className="block text-sm font-medium mb-1"
          >
            Departure
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="departureDate"
              type="date"
              {...register("departureDate", {
                required: "Departure date is required",
              })}
              className="block w-full pl-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)]"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          {errors.departureDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.departureDate.message}
            </p>
          )}
        </div>

        {tripType === "roundtrip" && (
          <div>
            <label
              htmlFor="returnDate"
              className="block text-sm font-medium mb-1"
            >
              Return
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDays className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="returnDate"
                type="date"
                {...register("returnDate", {
                  required:
                    tripType === "roundtrip"
                      ? "Return date is required for round trip"
                      : false,
                  validate: (value) => {
                    if (tripType === "roundtrip" && !value) {
                      return "Return date is required for round trip";
                    }
                    return true;
                  },
                })}
                className="block w-full pl-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)]"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            {errors.returnDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.returnDate.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Passengers Section */}
      <div className="flex flex-col sm:flex-wrap lg:flex-row items-start lg:items-end justify-between gap-6 mt-6 w-full">
        {/* Passenger Counts */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">Passengers</label>

          <div className="flex flex-wrap items-end gap-4 rounded-md bg-[var(--container-color-in)]">
            {/* Adults */}
            <div className="flex flex-col">
              <label className="block text-xs">Adults</label>
              <input
                type="number"
                min="1"
                defaultValue={1}
                {...register("adults")}
                className="w-20 rounded-md bg-[var(--container-color)] px-2 py-1 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Children */}
            <div className="flex flex-col">
              <label className="block text-xs">Children</label>
              <input
                type="number"
                min="0"
                defaultValue={0}
                {...register("children")}
                className="w-20 rounded-md bg-[var(--container-color)] px-2 py-1 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Infants */}
            <div className="flex flex-col">
              <label className="block text-xs">Infants</label>
              <input
                type="number"
                min="0"
                defaultValue={0}
                {...register("infants")}
                className="w-20 rounded-md bg-[var(--container-color)] px-2 py-1 text-center shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Cabin Class */}
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">Cabin Class</label>
          <select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
            className="w-full rounded-md bg-[var(--container-color)] px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium Economy</option>
            <option value="Business">Business</option>
            <option value="First">First Class</option>
          </select>
        </div>

        {/* Non-stop Option */}
        <div className="flex items-center gap-2">
          <input
            id="nonStop"
            type="checkbox"
            {...register("nonStop")}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="nonStop" className="text-sm">
            Non-stop flights only
          </label>
        </div>

        {/* Search Button */}
        <div className="w-full sm:w-auto">
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-[var(--button-color)] bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>
      </div>
    </form>
  );
}
