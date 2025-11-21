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
  const [searchResults, setSearchResults] = useState({
    outbound: [],
    return: [],
    isRoundTrip: false,
    selectedOutbound: null,
    selectedReturn: null
  });
  const [searchParams, setSearchParams] = useState(initialSearchParams || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("outbound");

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
      handleSearch(params || {});
    }
  }, [getSearchParamsFromUrl]);

  const handleSearch = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    setSearchResults({
      outbound: [],
      return: [],
      isRoundTrip: false,
      selectedOutbound: null,
      selectedReturn: null,
    });
    setActiveTab("outbound");

    // Update URL with search parameters
    updateSearchParams(searchParams);

    try {
      console.log("Flight search initiated with params:", searchParams);
      const isRoundTrip = searchParams.tripType === "roundtrip";

      // Use demo data for testing
      if (process.env.NEXT_PUBLIC_USE_DEMO_DATA === "true") {
        console.log("Using demo flight data");
        const { demoFlight } = await import("@/demoFlightData");
        setSearchResults({
          outbound: demoFlight.data || [],
          return: isRoundTrip ? demoFlight.returnData || [] : [],
          isRoundTrip,
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
      };

      // Add return date for round trips
      if (isRoundTrip && searchParams.returnDate) {
        searchData.returnDate = searchParams.returnDate;
      }

      console.log("Sending search request with data:", searchData);

      // Get flight results
      const results = await flightService.searchFlights(searchData);
      console.log("Search response:", results);

      if (!results) {
        throw new Error("No results received from the server");
      }

      // Handle both new and legacy response formats
      const formattedResults = {
        outbound: [],
        return: [],
        isRoundTrip,
      };

      // New format with outbound/return properties
      if (results.outbound || results.return) {
        formattedResults.outbound = Array.isArray(results.outbound)
          ? results.outbound
          : [];
        formattedResults.return =
          isRoundTrip && Array.isArray(results.return) ? results.return : [];
      }
      // Legacy array format
      else if (Array.isArray(results)) {
        formattedResults.outbound = results;
      }
      // Single result
      else if (results) {
        formattedResults.outbound = [results];
      }

      console.log(
        `Found ${formattedResults.outbound.length} outbound and ${formattedResults.return.length} return flights`
      );
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
        errorMessage = err.message;
      } else {
        errorMessage +=
          "Please try again or contact support if the problem persists.";
      }

      setError(errorMessage);
      setSearchResults({
        outbound: [],
        return: [],
        isRoundTrip: false,
        selectedOutbound: null,
        selectedReturn: null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectFlight = (flight, flightType) => {
    // Handle flight selection
    console.log(`Selected ${flightType} flight:`, flight);

    // Update selected flights in state
    setSearchResults((prev) => ({
      ...prev,
      selectedOutbound:
        flightType === "outbound" ? flight : prev.selectedOutbound,
      selectedReturn: flightType === "return" ? flight : prev.selectedReturn,
    }));

    // If this is the outbound flight and we're in round-trip mode, switch to return tab
    if (flightType === "outbound" && searchResults.isRoundTrip) {
      setActiveTab("return");
    }
  };

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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : searchResults.outbound.length > 0 ||
            searchResults.return.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchResults.isRoundTrip
                  ? "Select Your Flights"
                  : "Available Flights"}
              </h2>

              {/* Tab Navigation for Round Trips */}
              {searchResults.isRoundTrip && (
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab("outbound")}
                      className={`${
                        activeTab === "outbound"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } 
    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                      Outbound: {searchParams?.origin || "Origin"} →{" "}
                      {searchParams?.destination || "Destination"}
                    </button>
                    <button
                      onClick={() => setActiveTab("return")}
                      className={`${
                        activeTab === "return"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } 
    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                      Return: {searchParams?.destination || "Destination"} →{" "}
                      {searchParams?.origin || "Origin"}
                    </button>
                  </nav>
                </div>
              )}

              {/* Flight List */}
              <div className="space-y-4">
                {searchResults.isRoundTrip ? (
                  <>
                    {activeTab === "outbound" && (
                      <FlightList
                        flights={searchResults.outbound}
                        searchParams={{
                          ...searchParams,
                          isReturn: false,
                          date: searchParams.departureDate,
                        }}
                        onSelectFlight={(flight) =>
                          handleSelectFlight(flight, "outbound")
                        }
                      />
                    )}
                    {activeTab === "return" && (
                      <FlightList
                        flights={searchResults.return}
                        searchParams={{
                          ...searchParams,
                          isReturn: true,
                          date: searchParams.returnDate,
                          origin: searchParams.destination,
                          destination: searchParams.origin,
                        }}
                        onSelectFlight={(flight) =>
                          handleSelectFlight(flight, "return")
                        }
                      />
                    )}
                  </>
                ) : (
                  <FlightList
                    flights={searchResults.outbound}
                    searchParams={{
                      ...searchParams,
                      isReturn: false,
                      date: searchParams.departureDate,
                    }}
                    onSelectFlight={(flight) =>
                      handleSelectFlight(flight, "outbound")
                    }
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
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">
                No flights found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      )}
      {/* </div> */}
    </div>
  );
}
