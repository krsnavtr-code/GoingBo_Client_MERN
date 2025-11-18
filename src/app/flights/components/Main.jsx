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

      // The flightService.searchFlights() already processes the response and returns an array of flights
      const results = await flightService.searchFlights(searchData);

      console.log("Search response (formatted flights):", results);

      if (!results) {
        throw new Error("No results received from the server");
      }

      // Ensure results is an array
      const formattedResults = Array.isArray(results) ? results : [results];

      if (formattedResults.length === 0) {
        throw new Error("No flights found for the selected criteria");
      }

      console.log(`Found ${formattedResults.length} flights`);
      setSearchResults(formattedResults);
    } catch (err) {
      console.error("Flight search error:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
        response: err.response?.data
          ? "Response data available (see network tab)"
          : "No response data",
      });

      // Extract a more user-friendly error message
      let errorMessage = "Failed to search for flights. ";

      if (err.message.includes("network")) {
        errorMessage += "Please check your internet connection and try again.";
      } else if (err.message.includes("timeout")) {
        errorMessage += "The request took too long. Please try again.";
      } else if (
        err.message.includes("500") ||
        err.message.includes("server")
      ) {
        errorMessage +=
          "There was a problem with our servers. Please try again later.";
      } else if (err.message) {
        // Use the original error message if available
        errorMessage = err.message;
      } else {
        errorMessage +=
          "Please try again or contact support if the problem persists.";
      }

      setError(errorMessage);
      setSearchResults(null);
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
          <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {searchResults.length}{" "}
                  {searchResults.length === 1 ? "Flight" : "Flights"} Found
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Sort by:</span>
                    <select
                      className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm"
                      onChange={(e) => {
                        // Implement sorting logic here
                        const sortedResults = [...searchResults].sort(
                          (a, b) => {
                            const priceA =
                              a.Fare?.PublishedFare || a.price || 0;
                            const priceB =
                              b.Fare?.PublishedFare || b.price || 0;
                            return e.target.value === "price_asc"
                              ? priceA - priceB
                              : priceB - priceA;
                          }
                        );
                        setSearchResults(sortedResults);
                      }}
                    >
                      <option value="price_asc">Price (Low to High)</option>
                      <option value="price_desc">Price (High to Low)</option>
                      <option value="duration">Duration</option>
                      <option value="departure">Departure Time</option>
                    </select>
                  </div>
                </div>
              </div>

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
