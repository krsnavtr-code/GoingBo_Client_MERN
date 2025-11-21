'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import FlightSearch from '@/components/flights/FlightSearch';
import FlightList from '@/components/flights/FlightList';
import flightService from "@/services/flightService";

// Dynamically import FloatingSearchCard with SSR disabled to avoid hydration issues
const FloatingSearchCard = dynamic(
  () => import("@/components/FloatingSearchCard"),
  { ssr: false }
);

export default function FlightsPage({ searchParams: initialSearchParams }) {
  const router = useRouter();
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState(initialSearchParams || null);

  // Function to update URL with search parameters
  const updateSearchParams = useCallback((params) => {
    const searchParams = new URLSearchParams();

    // Add all non-empty parameters to the URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    });

    // Update the URL without causing a page reload
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  }, []);

  // Function to read search parameters from URL
  const getSearchParamsFromUrl = useCallback(() => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    const result = {};

    // Only include parameters we expect
    const expectedParams = [
      "origin",
      "destination",
      "departureDate",
      "returnDate",
      "tripType",
      "adults",
      "children",
      "infants",
      "cabinClass",
    ];

    expectedParams.forEach((param) => {
      const value = params.get(param);
      if (value !== null) {
        result[param] = value;
      }
    });

    return Object.keys(result).length > 0 ? result : null;
  }, []);

  // Load search parameters from URL on component mount
  useEffect(() => {
    const params = getSearchParamsFromUrl();
    if (params) {
      // If we have URL parameters, trigger a search
      handleSearch(params);
    }
  }, [getSearchParamsFromUrl]);

  const handleSearch = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    setSearchResults(null);
    setSearchParams(searchParams);

    // Update URL with search parameters
    updateSearchParams(searchParams);

    try {
      console.log("Flight search initiated with params:", searchParams);

      // Use demo data for testing
      if (process.env.NEXT_PUBLIC_USE_DEMO_DATA === "true") {
        console.log("Using demo flight data");
        const { demoFlight } = await import("@/demoFlightData");
        setSearchResults({
          data: [demoFlight.data], // Wrap in array as FlightList expects an array
          success: true,
        });
        setLoading(false);
        return;
      }

      // Format the search parameters for the API
      const searchData = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate,
        tripType: searchParams.tripType || "oneway",
        adults: parseInt(searchParams.adults) || 1,
        children: parseInt(searchParams.children) || 0,
        infants: parseInt(searchParams.infants) || 0,
        cabinClass: searchParams.cabinClass,
        currency: "INR",
        directFlight: false,
        oneStopFlight: true,
        preferredAirlines: [],
        // Add any additional parameters required by your API
      };

      // Add return date for round trips
      if (searchParams.tripType === "roundtrip" && searchParams.returnDate) {
        searchData.returnDate = searchParams.returnDate;
      }

      console.log("Sending search request with data:", searchData);

      // Call the flight service
      const response = await flightService.searchFlights(searchData);

      console.log("Search response (formatted flights):", response);

      // Process the response based on trip type
      if (searchParams.tripType === "roundtrip") {
        // For round trips, we expect both outbound and return flights
        setSearchResults({
          outbound: response.outbound || [],
          return: response.return || [],
          isRoundTrip: true,
        });
      } else {
        // For one-way trips, just set the outbound flights
        setSearchResults({
          outbound: Array.isArray(response)
            ? response
            : [response].filter(Boolean),
          return: [],
          isRoundTrip: false,
        });
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search flights. Please try again.");
      toast.error(err.message || "Failed to search flights. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFlightSelect = (flight) => {
    if (!user) {
      // Redirect to login with a return URL
      router.push(
        `/login?redirect=/flights/booking&flightId=${
          flight.id || flight.ResultIndex
        }`
      );
      return;
    }

    // Prepare flight data for the booking page
    const flightData = {
      id: flight.id || flight.ResultIndex,
      sessionId: flight.sessionId || flight.TraceId,
      resultIndex: flight.resultIndex || flight.ResultIndex,
      origin: flight.origin || flight.Origin?.Airport?.AirportCode,
      destination:
        flight.destination || flight.Destination?.Airport?.AirportCode,
      departureTime: flight.departureTime || flight.DepartureTime,
      arrivalTime: flight.arrivalTime || flight.ArrivalTime,
      airline: flight.airline || flight.Airline?.AirlineName,
      flightNumber: flight.flightNumber || flight.FlightNumber,
      price: flight.price || flight.Fare?.PublishedFare,
      cabinClass: flight.cabinClass || flight.CabinClass,
    };

    // Store flight data in session storage for the booking page
    sessionStorage.setItem("selectedFlight", JSON.stringify(flightData));

    // Navigate to booking page with flight details
    router.push(
      `/flights/booking?sessionId=${flightData.sessionId}&resultIndex=${flightData.resultIndex}`
    );
  };

  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // This ensures the component is only rendered on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="container text-[var(--text-color)] mx-auto px-4 py-8">
      {/* {isMounted && <FloatingSearchCard />} */}
      <div className="absolute top-[160px] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <FloatingSearchCard />
      </div>
      <div className="pt-18 pb-8">
        <FlightSearch
          onSearch={handleSearch}
          loading={loading}
          initialValues={{
            origin: "",
            destination: "",
            departureDate: new Date().toISOString().split("T")[0],
            returnDate: "",
            tripType: "oneway",
            adults: 1,
            children: 0,
            infants: 0,
            cabinClass: "Economy",
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
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg shadow-md p-4 mb-6">
              <div className="space-y-4">
                {searchResults && (
                  <FlightList
                    flights={
                      Array.isArray(searchResults)
                        ? searchResults
                        : searchResults.data || []
                    }
                    onSelectFlight={handleFlightSelect}
                    tripType={searchParams?.tripType || "oneway"}
                  />
                )}
              </div>

              {(Array.isArray(searchResults)
                ? searchResults.length
                : searchResults?.data?.length || 0) > 5 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      // Implement pagination or "load more" functionality
                      console.log("Load more flights");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Load More Flights
                  </button>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Need help with your booking?
              </h3>
              <p className="text-blue-700 text-sm">
                Our customer support team is available 24/7 to assist you with
                your flight booking. Call us at{" "}
                <a
                  href="tel:+1234567890"
                  className="font-semibold hover:underline"
                >
                  +1 (234) 567-890
                </a>{" "}
                or email us at{" "}
                <a
                  href="mailto:support@goingbo.com"
                  className="font-semibold hover:underline"
                >
                  support@goingbo.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
      {/* </div> */}
    </div>
  );
}
