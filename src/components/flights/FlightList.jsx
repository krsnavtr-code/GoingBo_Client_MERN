'use client';

import { useState } from 'react';
import { 
  Clock, 
  Plane, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Users, 
  Briefcase, 
  PlusCircle,
  Wifi,
  Utensils,
  Film,
  Luggage,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function FlightList({ flights, onSelectFlight, tripType = 'oneway' }) {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [sortBy, setSortBy] = useState("price_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 20;

  // Sort flights based on the selected criteria
  const sortedFlights = [...(flights || [])].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return (a.fare?.totalFare || 0) - (b.fare?.totalFare || 0);
      case "price_desc":
        return (b.fare?.totalFare || 0) - (a.fare?.totalFare || 0);
      case "duration":
        return (a.durationInMinutes || 0) - (b.durationInMinutes || 0);
      case "departure":
        return new Date(a.departureTime) - new Date(b.departureTime);
      default:
        return 0;
    }
  });

  // Calculate pagination
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = sortedFlights.slice(
    indexOfFirstFlight,
    indexOfLastFlight
  );
  const totalPages = Math.ceil(sortedFlights.length / flightsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleFlightDetails = (flightId) => {
    setSelectedFlight(selectedFlight === flightId ? null : flightId);
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "--:--";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "--:--";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  const handleSelectFlight = (flight) => {
    if (tripType === "roundtrip") {
      // For round trips, we need to select both outbound and return flights
      if (!selectedOutbound) {
        setSelectedOutbound(flight);
      } else if (!selectedReturn && flight.id !== selectedOutbound.id) {
        setSelectedReturn(flight);
        if (onSelectFlight) {
          onSelectFlight({
            outbound: selectedOutbound,
            return: flight,
          });
        }
      }
    } else {
      // For one-way trips, just select the flight
      if (onSelectFlight) {
        onSelectFlight(flight);
      }
    }
  };

  if (!flights || flights.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow p-6">
        <Plane className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No flights found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  const renderAmenities = (amenities) => (
    <div className="flex items-center space-x-2 mt-2">
      {amenities.wifi && (
        <Wifi className="h-4 w-4 text-blue-500" title="WiFi" />
      )}
      {amenities.meals && (
        <Utensils className="h-4 w-4 text-green-500" title="Meals" />
      )}
      {amenities.entertainment && (
        <Film className="h-4 w-4 text-purple-500" title="Entertainment" />
      )}
      {amenities.baggage && (
        <Luggage className="h-4 w-4 text-amber-500" title="Baggage included" />
      )}
    </div>
  );

  const renderFlightCard = (flight, isSelected = false, isReturn = false) => (
    <div
      key={`${flight.id}-${isReturn ? "return" : "outbound"}`}
      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-blue-500 border-blue-300"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Plane className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {typeof flight.airline === "object"
                    ? `${flight.airline.name || "Unknown Airline"} • ${
                        flight.airline.number || ""
                      }`
                    : `${flight.airline || "Unknown Airline"} • ${
                        flight.flightNumber || ""
                      }`}
                </div>
                <div className="text-xs text-gray-500">
                  {flight.aircraftType}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(
                flight.fare?.totalFare || 0,
                flight.fare?.currency
              )}
            </div>
            <div className="text-xs text-gray-500">
              {flight.fareType} •{" "}
              {flight.refundable ? "Refundable" : "Non-refundable"}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold">
              {formatTime(flight.departureTime)}
            </div>
            <div className="text-sm text-gray-500">{flight.origin}</div>
            <div className="text-xs text-gray-400">
              {formatDate(flight.departureTime)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500">
              <Clock className="inline-block h-3 w-3 mr-1" />
              {flight.duration}
            </div>
            <div className="relative h-px bg-gray-300 my-2">
              <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-300"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
            <div className="text-xs text-blue-600">
              {flight.stops === 0
                ? "Non-stop"
                : `${flight.stops} ${flight.stops === 1 ? "stop" : "stops"}`}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">
              {formatTime(flight.arrivalTime)}
            </div>
            <div className="text-sm text-gray-500">{flight.destination}</div>
            <div className="text-xs text-gray-400">
              {formatDate(flight.arrivalTime)}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-500">
                Baggage: {flight.baggage || "Check Fare Rules"}
              </div>
              {flight.amenities && renderAmenities(flight.amenities)}
            </div>
            <button
              onClick={() => handleSelectFlight(flight)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isSelected
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSelected ? (
                <span className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Selected
                </span>
              ) : (
                <span className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-1" /> Select
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {flights.length} {flights.length === 1 ? "Flight" : "Flights"}{" "}
              Found
            </h2>
            {flights.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Showing {indexOfFirstFlight + 1}-
                {Math.min(indexOfLastFlight, flights.length)} of{" "}
                {flights.length} flights
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1); // Reset to first page when sorting changes
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="duration">Duration</option>
              <option value="departure">Departure Time</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {tripType === "roundtrip" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Outbound Flights
              </h3>
              <div className="space-y-4">
                {currentFlights
                  .filter((flight) => !flight.isReturn)
                  .map((flight) =>
                    renderFlightCard(
                      flight,
                      selectedOutbound?.id === flight.id,
                      false
                    )
                  )}
              </div>
            </div>
          )}

          {tripType === "roundtrip" && selectedOutbound && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Return Flights
              </h3>
              <div className="space-y-4">
                {currentFlights
                  .filter((flight) => flight.isReturn)
                  .map((flight) =>
                    renderFlightCard(
                      flight,
                      selectedReturn?.id === flight.id,
                      true
                    )
                  )}
              </div>
            </div>
          )}

          {tripType !== "roundtrip" &&
            currentFlights.map((flight) =>
              renderFlightCard(
                flight,
                selectedOutbound?.id === flight.id,
                false
              )
            )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                First
              </button>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                Next
              </button>
              <button
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                Last
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
