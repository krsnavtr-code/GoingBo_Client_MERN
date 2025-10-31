'use client';

import { useState, useEffect } from 'react';
import FloatingSearchCard from '@/components/FloatingSearchCard';
import FlightSearch from '@/components/flights/FlightSearch';
import FlightList from '@/components/flights/FlightList';
import searchFlights from '@/components/FloatingSearchCard';

export default function FlightsPage() {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchFlights(searchParams);
      setSearchResults(results.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to search for flights');
      console.error('Flight search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Floating Search Card */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <FloatingSearchCard />
      </div>

      <div className="pt-26 pb-8">
        <div className="">
          <FlightSearch onSearch={handleSearch} loading={loading} />
        </div>

        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {searchResults && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>
            <FlightList flights={searchResults.flights} />
          </div>
        )}
      </div>
    </div>
  );
}
