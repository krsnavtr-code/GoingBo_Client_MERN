'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import FlightSearch from '@/components/flights/FlightSearch';
import FlightList from '@/components/flights/FlightList';
import { searchFlights } from '@/utils/flightApi';

// Dynamically import FloatingSearchCard with SSR disabled to avoid hydration issues
const FloatingSearchCard = dynamic(
  () => import('@/components/FloatingSearchCard'),
  { ssr: false }
);

export default function FlightsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      // Validate required fields
      if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
        throw new Error('Please fill in all required fields');
      }

      const searchData = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate,
        adults: parseInt(searchParams.adults) || 1,
        children: parseInt(searchParams.children) || 0,
        infants: parseInt(searchParams.infants) || 0,
        cabinClass: searchParams.cabinClass || 'Economy',
        tripType: searchParams.tripType || 'oneway'
      };

      // Add return date only for round trips
      if (searchParams.tripType === 'roundtrip' && searchParams.returnDate) {
        searchData.returnDate = searchParams.returnDate;
        searchData.journeyType = '2';
      } else {
        searchData.journeyType = '1';
      }

      console.log('Searching flights with params:', searchData);
      
      const response = await searchFlights(searchData);
      
      if (response) {
        // Handle different response formats
        let results = [];
        
        if (Array.isArray(response)) {
          results = response; // Direct array response
        } else if (response.data) {
          results = Array.isArray(response.data) ? response.data : [response.data];
        } else if (response.results) {
          results = Array.isArray(response.results) ? response.results : [response.results];
        } else if (response.error) {
          throw new Error(response.error.message || 'Error fetching flights');
        } else {
          throw new Error('Unexpected response format from server');
        }
        
        if (results.length === 0) {
          throw new Error('No flights found for the selected criteria');
        }
        
        setSearchResults(results);
      } else {
        throw new Error('No response received from server');
      }
    } catch (err) {
      console.error('Flight search error:', err);
      setError(
        err.message || 
        (err.response?.data?.error?.message || 'Failed to search for flights. Please try again.')
      );
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFlightSelect = (flight) => {
    if (!user) {
      // Redirect to login with a return URL
      router.push(`/login?redirect=/flights/booking&flightId=${flight.id}`);
      return;
    }
    // Navigate to booking page with flight details
    router.push(`/flights/booking?sessionId=${flight.sessionId}&resultIndex=${flight.resultIndex}`);
  };

  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // This ensures the component is only rendered on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {isMounted && <FloatingSearchCard />}
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Search Flights</h1>
          <FlightSearch 
            onSearch={handleSearch} 
            loading={loading} 
            initialValues={{
              origin: '',
              destination: '',
              departureDate: new Date().toISOString().split('T')[0],
              returnDate: '',
              tripType: 'oneway',
              adults: 1,
              children: 0,
              infants: 0,
              cabinClass: 'Economy'
            }}
          />
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
            {searchResults && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {searchResults.length} Flights Found
                </h2>
                <FlightList 
                  flights={searchResults} 
                  onSelectFlight={handleFlightSelect}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
