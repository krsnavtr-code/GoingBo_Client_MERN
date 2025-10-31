'use client';

import { useState } from 'react';
import HotelSearch from '@/components/hotels/HotelSearch';
import HotelList from '@/components/hotels/HotelList';
import { searchHotels } from '@/services/hotelService';
import FloatingSearchCard from '@/components/FloatingSearchCard';

export default function HotelsPage() {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  const handleSearch = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchHotels(params);
      setSearchResults(results);
      setSearchParams(params);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search for hotels');
      console.error('Hotel search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-[var(--text-color)] mx-auto px-4 py-8">
      {/* Floating Search Card */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <FloatingSearchCard />
      </div>

      <div className="pt-18 pb-8">
        <HotelSearch onSearch={handleSearch} loading={loading} />
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
          <h2 className="text-2xl font-semibold mb-6">Available Hotels</h2>
          <HotelList
            hotels={searchResults.Hotels || []}
            searchParams={searchParams}
          />
        </div>
      )}
    </div>
  );
}
