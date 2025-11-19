'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CalendarDays,
  Users,
  PlaneTakeoff,
  PlaneLanding,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { searchAirports, getAirportByCode } from "@/utils/airportData";
import { toast } from "react-hot-toast";

// Cabin class mapping to TBO format
const CABIN_CLASS_MAP = {
  Economy: "2",
  "Premium Economy": "3",
  Business: "4",
  First: "5",
};

export default function FlightSearch({
  onSearch,
  loading: externalLoading,
  initialValues = {},
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isRoundTrip, setIsRoundTrip] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      tripType: "oneway",
      cabinClass: "Economy",
      adults: 1,
      children: 0,
      infants: 0,
      ...initialValues,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const loading = externalLoading || isSubmitting;

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const tripType = watch("tripType");
  const cabinClass = watch("cabinClass");

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginSuggestions(false);
      }
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowDestinationSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
    setValue("origin", airport.code);
    setShowOriginSuggestions(false);
  };

  // Handle selecting a destination
  const selectDestination = (airport) => {
    setSelectedDestination(airport);
    setValue("destination", airport.code);
    setShowDestinationSuggestions(false);
  };

  // Swap origin and destination
  const swapLocations = () => {
    const temp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(temp);
    setValue("origin", selectedDestination?.code || "");
    setValue("destination", selectedOrigin?.code || "");
  };

  const validatePassengers = (adults, children, infants) => {
    clearErrors(["adults", "children", "infants"]);
    let isValid = true;

    if (adults < 1) {
      setError("adults", {
        type: "min",
        message: "At least 1 adult is required",
      });
      isValid = false;
    }

    if (infants > adults) {
      setError("infants", {
        type: "max",
        message: "Cannot have more infants than adults",
      });
      isValid = false;
    }

    if (adults + children + infants > 9) {
      setError("adults", {
        type: "maxPassengers",
        message: "Maximum 9 passengers in total",
      });
      isValid = false;
    }

    return isValid;
  };

  const formatDateForAPI = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const onSubmit = async (data) => {
    setFormError("");

    // Validate passengers
    if (!validatePassengers(data.adults, data.children, data.infants)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the data for the API
      const searchData = {
        origin: data.origin,
        destination: data.destination,
        departureDate: formatDateForAPI(data.departureDate),
        tripType: data.tripType,
        adults: parseInt(data.adults) || 1,
        children: parseInt(data.children) || 0,
        infants: parseInt(data.infants) || 0,
        cabinClass: CABIN_CLASS_MAP[data.cabinClass] || "2",
        currency: "INR",
        directFlight: false,
        oneStopFlight: true,
      };

      if (data.tripType === "roundtrip" && data.returnDate) {
        searchData.returnDate = formatDateForAPI(data.returnDate);
      }

      // Validate origin and destination
      if (searchData.origin === searchData.destination) {
        setFormError("Origin and destination cannot be the same");
        return;
      }

      // Call the parent component's onSearch with the formatted data
      await onSearch(searchData);
    } catch (error) {
      console.error("Search error:", error);
      setFormError(
        error.message || "An error occurred while searching for flights"
      );
      toast.error("Failed to search flights. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2 max-w-5xl mx-auto bg-[var(--container-color-in)] px-5 py-2 pb-10 rounded-xl"
      noValidate
    >
      {/* Trip Type Toggle */}
      <div className="flex space-x-2 mb-2">
        <button
          type="button"
          className={`px-2 py-1 rounded-md text-[var(--button-color)] bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] cursor-pointer ${
            tripType === "oneway"
              ? "bg-[var(--logo-color-two)] hover:bg-[var(--logo-color-two)]"
              : "bg-[var(--logo-color)]"
          }`}
          onClick={() => setValue("tripType", "oneway")}
        >
          One Way
        </button>
        <button
          type="button"
          className={`px-2 py-1 rounded-md text-[var(--button-color)] bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] cursor-pointer ${
            tripType === "roundtrip"
              ? "bg-[var(--logo-color-two)] hover:bg-[var(--logo-color-two)]"
              : "bg-[var(--logo-color)]"
          }`}
          onClick={() => setValue("tripType", "roundtrip")}
        >
          Round Trip
        </button>
      </div>

      {/* Origin and Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative" ref={originRef}>
          <label className="block text-sm font-medium mb-1">From</label>
          <div className="relative">
            <PlaneTakeoff className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-[var(--border-color)] bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City or Airport"
              onChange={handleOriginChange}
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-[var(--container-color)] shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
              {originSuggestions.map((airport) => (
                <div
                  key={`${airport.code}-${airport.name}`}
                  className="px-4 py-2 hover:bg-[var(--container-color-in)] cursor-pointer"
                  onClick={() => {
                    setSelectedOrigin(airport);
                    setValue("origin", airport.code);
                    setShowOriginSuggestions(false);
                  }}
                >
                  <div className="font-medium">
                    {airport.city} ({airport.code})
                  </div>
                  <div className="text-sm text-[var(--text-color-light)]">
                    {airport.name}
                  </div>
                </div>
              ))}
            </div>
          )}
          <input
            type="hidden"
            {...register("origin", { required: "Origin is required" })}
          />
          {errors.origin && (
            <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>
          )}
        </div>

        <div className="relative" ref={destinationRef}>
          <label className="block text-sm font-medium mb-1">To</label>
          <div className="relative">
            <PlaneLanding className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-[var(--border-color)] bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City or Airport"
              onChange={handleDestinationChange}
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-[var(--container-color)] shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
              {destinationSuggestions.map((airport) => (
                <div
                  key={`${airport.code}-${airport.name}`}
                  className="px-4 py-2 hover:bg-[var(--container-color-in)] cursor-pointer"
                  onClick={() => {
                    setSelectedDestination(airport);
                    setValue("destination", airport.code);
                    setShowDestinationSuggestions(false);
                  }}
                >
                  <div className="font-medium">
                    {airport.city} ({airport.code})
                  </div>
                  <div className="text-sm text-gray-500">{airport.name}</div>
                </div>
              ))}
            </div>
          )}
          <input
            type="hidden"
            {...register("destination", {
              required: "Destination is required",
            })}
          />
          {errors.destination && (
            <p className="mt-1 text-sm text-red-600">
              {errors.destination.message}
            </p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Departure</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full pl-10 pr-3 py-2 border border-[var(--border-color)] bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              {...register("departureDate", {
                required: "Departure date is required",
                validate: {
                  futureDate: (value) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      new Date(value) >= today ||
                      "Departure date cannot be in the past"
                    );
                  },
                },
              })}
              disabled={loading}
            />
          </div>
          {errors.departureDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.departureDate.message}
            </p>
          )}
        </div>

        <div className={tripType === "oneway" ? "opacity-50" : ""}>
          <label className="block text-sm font-medium mb-1 cursor-pointer">
            Return
          </label>
          <div
            className="relative"
            onClick={(e) => {
              if (tripType === "oneway") {
                e.stopPropagation();
                setValue("tripType", "roundtrip");
              }
            }}
          >
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              type="date"
              min={
                watch("departureDate") || new Date().toISOString().split("T")[0]
              }
              className="w-full pl-10 pr-3 py-2 border border-[var(--border-color)] bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
              {...register("returnDate", {
                required:
                  tripType === "roundtrip" ? "Return date is required" : false,
                validate: (value) => {
                  if (tripType === "oneway") return true;
                  if (!value) return "Return date is required";

                  const departureDate = watch("departureDate");
                  if (departureDate) {
                    const returnDate = new Date(value);
                    const depDate = new Date(departureDate);

                    // Set both dates to start of day for accurate comparison
                    returnDate.setHours(0, 0, 0, 0);
                    depDate.setHours(0, 0, 0, 0);

                    if (returnDate < depDate) {
                      return "Return date must be after departure date";
                    }
                  }

                  return true;
                },
              })}
            />
            {errors.returnDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.returnDate.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Passengers and Cabin Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Adults</label>
            <select
              className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              {...register("adults", {
                valueAsNumber: true,
                min: { value: 1, message: "At least 1 adult required" },
                max: { value: 9, message: "Maximum 9 adults" },
              })}
              disabled={loading}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Adult" : "Adults"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Children</label>
            <select
              className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              {...register("children", {
                valueAsNumber: true,
                min: { value: 0, message: "Cannot be negative" },
                max: { value: 8, message: "Maximum 8 children" },
              })}
              disabled={loading}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Child" : "Children"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Infants</label>
            <select
              className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              {...register("infants", {
                valueAsNumber: true,
                min: { value: 0, message: "Cannot be negative" },
                max: { value: 5, message: "Maximum 5 infants allowed" },
              })}
              disabled={loading}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Infant" : "Infants"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cabin Class</label>
          <select
            className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            {...register("cabinClass")}
            disabled={loading}
          >
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium Economy</option>
            <option value="Business">Business</option>
            <option value="First">First Class</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-[var(--button-color)] bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--button-color)]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Search Flights
            </>
          )}
        </button>
      </div>
    </form>
  );
}
