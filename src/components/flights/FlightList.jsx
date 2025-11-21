'use client';

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  Plane,
  DollarSign,
  Briefcase,
  Wifi,
  Utensils,
  Film,
  Luggage,
  CheckCircle2,
  XCircle,
  X,
  Calendar,
  Clock as ClockIcon,
  Info,
  PlaneTakeoff,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Reusable Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of the middle section
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the start or end
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between mt-6 border-t border-gray-200 pt-4">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
              currentPage === 1
                ? "text-gray-300"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">First</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            <ChevronLeft className="h-5 w-5 -ml-2" aria-hidden="true" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
              currentPage === 1
                ? "text-gray-300"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              } ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-300"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-300"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">Last</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
            <ChevronRight className="h-5 w-5 -mr-2" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FlightList({
  flights,
  onSelectFlight,
  tripType = "oneway",
}) {
  // Handle both array and object response formats
  const outboundFlights = Array.isArray(flights?.outbound)
    ? flights.outbound
    : [];
  const returnFlights = Array.isArray(flights?.return) ? flights.return : [];
  const isRoundTrip = tripType === "roundtrip";

  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [currentSelection, setCurrentSelection] = useState("outbound");
  const [sortBy, setSortBy] = useState("price_asc");
  const [currentPage, setCurrentPage] = useState({ outbound: 1, return: 1 });
  const [selectedFlightDetails, setSelectedFlightDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const flightsPerPage = 10; // Show 10 flights per page

  // Handle flight selection
  const handleFlightSelect = (flight, type = "outbound") => {
    if (type === "outbound") {
      setSelectedOutbound(flight);
      if (isRoundTrip) {
        setCurrentSelection("return");
        // Reset return selection when changing outbound flight
        setSelectedReturn(null);
      } else {
        onSelectFlight(flight);
      }
    } else {
      setSelectedReturn(flight);
      onSelectFlight({
        outbound: selectedOutbound,
        return: flight,
      });
    }
  };

  // Check if we have any flights to display
  const hasFlights =
    outboundFlights.length > 0 || (isRoundTrip && returnFlights.length > 0);

  // Reset to first page when flights change
  useEffect(() => {
    setCurrentPage({ outbound: 1, return: 1 });
  }, [outboundFlights, returnFlights]);

  // Sort flights based on the selected criteria
  const sortFlights = (flights) => {
    return [...flights].sort((a, b) => {
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
  };

  // Sort outbound and return flights
  const sortedOutboundFlights = sortFlights(outboundFlights);
  const sortedReturnFlights = sortFlights(returnFlights);

  // Calculate pagination for outbound flights
  const indexOfLastOutbound = currentPage.outbound * flightsPerPage;
  const indexOfFirstOutbound = indexOfLastOutbound - flightsPerPage;
  const currentOutboundFlights = sortedOutboundFlights.slice(
    indexOfFirstOutbound,
    indexOfLastOutbound
  );
  const totalOutboundPages =
    Math.ceil(sortedOutboundFlights.length / flightsPerPage) || 1;

  // Calculate pagination for return flights
  const indexOfLastReturn = currentPage.return * flightsPerPage;
  const indexOfFirstReturn = indexOfLastReturn - flightsPerPage;
  const currentReturnFlights = sortedReturnFlights.slice(
    indexOfFirstReturn,
    indexOfLastReturn
  );
  const totalReturnPages =
    Math.ceil(sortedReturnFlights.length / flightsPerPage) || 1;

  // Change page for outbound or return flights
  const paginate = (pageNumber, flightType = "outbound") => {
    const pageKey = flightType === "return" ? "return" : "outbound";
    const maxPage =
      flightType === "return" ? totalReturnPages : totalOutboundPages;

    if (pageNumber < 1 || pageNumber > maxPage) return;

    setCurrentPage((prev) => ({
      ...prev,
      [pageKey]: pageNumber,
    }));

    // Scroll to top of results
    const resultsElement = document.getElementById(`${flightType}-flights`);
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "--:--";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // <-- 24-hour format
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

  if (!hasFlights) {
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

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFlightCardClick = (flight) => {
    setSelectedFlightDetails(flight);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  const renderFlightCard = (flight, isSelected = false, isReturn = false) => (
    <div
      key={`${flight.id}-${isReturn ? "return" : "outbound"}`}
      onClick={() => handleFlightCardClick(flight)}
      className={`border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
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
                  {/* {flight.airline.name || "Unknown Airline"} */}
                  {typeof flight.airline === "object"
                    ? `${flight.airline.name || "Unknown Airline"} • ${
                        flight.airline.number || ""
                      }`
                    : `${flight.airline || "Unknown Airline"} • ${
                        flight.flightNumber || ""
                      }`}
                </div>
                <div className="text-xs text-gray-500">
                  {flight.airline?.code || "Unknown Code"} •
                  {flight.airline?.number || flight.flightNumber || "Unknown"}
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
              {flight.fare?.refundable ? "Refundable" : "Non-refundable"}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-400">
              {formatDate(flight.departureTime)}
            </div>
            <div className="text-2xl font-bold">
              {formatTime(flight.departureTime)}
            </div>
            <div className="text-sm text-gray-500">{flight.origin}</div>
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
            <div className="text-xs text-gray-400">
              {formatDate(flight.arrivalTime)}
            </div>
            <div className="text-2xl font-bold">
              {formatTime(flight.arrivalTime)}
            </div>
            <div className="text-sm text-gray-500">
              {flight.destinationInfo?.city} • {flight.destinationInfo?.code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFlightDetailsModal = () => (
    <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900">Flight Details</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Flight Summary */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-blue-50 p-4 rounded-lg">
            <div>
              <div className="flex items-center text-lg font-semibold">
                <PlaneTakeoff className="h-5 w-5 text-blue-600 mr-2" />
                {selectedFlightDetails?.origin} →{" "}
                {selectedFlightDetails?.destination}
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(selectedFlightDetails?.departureTime)}
                <span className="mx-2">•</span>
                <ClockIcon className="h-4 w-4 mr-1" />
                {formatTime(selectedFlightDetails?.departureTime)} -{" "}
                {formatTime(selectedFlightDetails?.arrivalTime)}
              </div>
            </div>
            <div className="mt-3 md:mt-0 text-right">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  selectedFlightDetails?.fare?.totalFare || 0,
                  selectedFlightDetails?.fare?.currency
                )}
              </div>
              <div className="text-sm text-gray-600">
                {selectedFlightDetails?.fareType} •{" "}
                {selectedFlightDetails?.fare?.refundable
                  ? "Refundable"
                  : "Non-refundable"}
              </div>
            </div>
          </div>

          {/* Flight Itinerary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Plane className="h-5 w-5 text-blue-600 mr-2" />
              Flight Itinerary
            </h3>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Airline Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white p-1 rounded-md shadow-sm mr-3">
                    <Plane className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {selectedFlightDetails?.airline?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedFlightDetails?.airline?.code}
                      {selectedFlightDetails?.airline?.number} •{" "}
                      {selectedFlightDetails?.aircraft}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedFlightDetails?.duration}
                </div>
              </div>

              {/* Flight Route */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <div className="text-2xl font-bold">
                      {formatTime(selectedFlightDetails?.departureTime)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(selectedFlightDetails?.departureTime)}
                    </div>
                    <div className="font-medium mt-1">
                      {selectedFlightDetails?.origin}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedFlightDetails?.originInfo?.city},{" "}
                      {selectedFlightDetails?.originInfo?.country}
                    </div>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mb-1">
                      {selectedFlightDetails?.stops === 0
                        ? "Non-stop"
                        : `${selectedFlightDetails?.stops} ${
                            selectedFlightDetails?.stops === 1
                              ? "Stop"
                              : "Stops"
                          }`}
                    </div>
                    <div className="relative w-32">
                      <div className="h-px bg-gray-300 w-full absolute top-1/2"></div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600"></div>
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedFlightDetails?.duration}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatTime(selectedFlightDetails?.arrivalTime)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(selectedFlightDetails?.arrivalTime)}
                    </div>
                    <div className="font-medium mt-1">
                      {selectedFlightDetails?.destination}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedFlightDetails?.destinationInfo?.city},{" "}
                      {selectedFlightDetails?.destinationInfo?.country}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fare Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              Fare Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Base Fare</h4>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Adult (x1)</span>
                    <span>
                      {formatCurrency(
                        selectedFlightDetails?.fare?.baseFare || 0,
                        selectedFlightDetails?.fare?.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Taxes & Fees</span>
                    <span>
                      {formatCurrency(
                        (selectedFlightDetails?.fare?.totalFare || 0) -
                          (selectedFlightDetails?.fare?.baseFare || 0),
                        selectedFlightDetails?.fare?.currency
                      )}
                    </span>
                  </div>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Total Amount
                  </h4>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {formatCurrency(
                        selectedFlightDetails?.fare?.totalFare || 0,
                        selectedFlightDetails?.fare?.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Baggage Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Luggage className="h-5 w-5 text-purple-600 mr-2" />
              Baggage Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Cabin Baggage
                </h4>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  {selectedFlightDetails?.baggage?.cabin ||
                    "1 x 7kg (Max. 55x40x20cm)"}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Check-in Baggage
                </h4>
                {selectedFlightDetails?.baggage?.checkIn ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    {selectedFlightDetails.baggage.checkIn}
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-gray-600">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    No check-in baggage included
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Info className="h-5 w-5 text-yellow-600 mr-2" />
              Onboard Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                <Wifi className="h-6 w-6 text-blue-500 mb-1" />
                <span className="text-sm text-center">
                  WiFi{" "}
                  {selectedFlightDetails?.amenities?.wifi
                    ? "Available"
                    : "Not Available"}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                <Utensils className="h-6 w-6 text-green-500 mb-1" />
                <span className="text-sm text-center">
                  {selectedFlightDetails?.amenities?.meals
                    ? "Meal Included"
                    : "No Meal"}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                <Film className="h-6 w-6 text-purple-500 mb-1" />
                <span className="text-sm text-center">
                  {selectedFlightDetails?.amenities?.entertainment
                    ? "Entertainment"
                    : "No Entertainment"}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                <Briefcase className="h-6 w-6 text-amber-500 mb-1" />
                <span className="text-sm text-center">
                  Power Outlets{" "}
                  {selectedFlightDetails?.amenities?.powerOutlets
                    ? "Available"
                    : "Not Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Information
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Check-in closes 45 minutes before departure</li>
                    <li>Valid photo ID is mandatory for check-in</li>
                    <li>Baggage allowance may vary by fare type</li>
                    <li>Flight schedules are subject to change</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 mb-3 sm:mb-0">
            Need help?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Handle book now action
                closeModal();
                if (onSelectFlight) {
                  onSelectFlight(selectedFlightDetails);
                }
              }}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {isModalOpen && renderFlightDetailsModal()}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-8">
          {/* Outbound Flights Section */}
          <div id="outbound-flights">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Outbound Flights
                {isRoundTrip && selectedOutbound && (
                  <span className="ml-2 text-sm font-normal text-green-600">
                    {currentSelection === "outbound"
                      ? "(Selecting)"
                      : "(Selected)"}
                  </span>
                )}
              </h3>
              {outboundFlights.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="price_asc">Price (Low to High)</option>
                    <option value="price_desc">Price (High to Low)</option>
                    <option value="duration">Duration</option>
                    <option value="departure">Departure Time</option>
                  </select>
                </div>
              )}
            </div>

            {outboundFlights.length > 0 ? (
              <div className="space-y-4">
                {currentOutboundFlights.map((flight) =>
                  renderFlightCard(
                    flight,
                    selectedOutbound?.id === flight.id,
                    false
                  )
                )}

                {/* Outbound Pagination */}
                {totalOutboundPages > 1 && (
                  <Pagination
                    currentPage={currentPage.outbound}
                    totalPages={totalOutboundPages}
                    onPageChange={(page) => paginate(page, "outbound")}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No outbound flights found</p>
              </div>
            )}
          </div>

          {/* Return Flights Section - Only show for round trips */}
          {isRoundTrip && (
            <div
              id="return-flights"
              className={`pt-6 border-t border-gray-200 ${
                !selectedOutbound ? "opacity-50" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Return Flights
                  {selectedOutbound && (
                    <span className="ml-2 text-sm font-normal text-blue-600">
                      {currentSelection === "return"
                        ? "(Selecting...)"
                        : selectedReturn
                        ? "(Selected)"
                        : ""}
                    </span>
                  )}
                </h3>
                {returnFlights.length > 0 && selectedOutbound && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="price_asc">Price (Low to High)</option>
                      <option value="price_desc">Price (High to Low)</option>
                      <option value="duration">Duration</option>
                      <option value="departure">Departure Time</option>
                    </select>
                  </div>
                )}
              </div>

              {!selectedOutbound ? (
                <div className="text-center py-8 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-700">
                    Please select an outbound flight first
                  </p>
                </div>
              ) : returnFlights.length > 0 ? (
                <div className="space-y-4">
                  {currentReturnFlights.map((flight) =>
                    renderFlightCard(
                      flight,
                      selectedReturn?.id === flight.id,
                      true
                    )
                  )}

                  {/* Return Pagination */}
                  {totalReturnPages > 1 && (
                    <Pagination
                      currentPage={currentPage.return}
                      totalPages={totalReturnPages}
                      onPageChange={(page) => paginate(page, "return")}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No return flights found</p>
                </div>
              )}
            </div>
          )}

          {/* One-way flights (when not in round-trip mode) */}
          {!isRoundTrip && outboundFlights.length > 0 && (
            <div className="space-y-4">
              {currentOutboundFlights.map((flight) =>
                renderFlightCard(
                  flight,
                  selectedOutbound?.id === flight.id,
                  false
                )
              )}

              {/* One-way Pagination */}
              {totalOutboundPages > 1 && (
                <Pagination
                  currentPage={currentPage.outbound}
                  totalPages={totalOutboundPages}
                  onPageChange={(page) => paginate(page, "outbound")}
                />
              )}
            </div>
          )}
        </div>

        {/* Pagination component is now included in each flight section */}
      </div>
    </div>
  );
}
