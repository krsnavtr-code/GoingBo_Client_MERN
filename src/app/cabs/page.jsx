'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAPI } from "@/services/api";
import {
  MapPin,
  Users,
  Car,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import FloatingSearchCard from "@/components/FloatingSearchCard";
import CabSearchForm from "./components/CabSearchForm";
import CabCard from "./components/CabCard";

export default function CabsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useState({
    pickup: "",
    drop: "",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
    passengers: 1,
  });

  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCab, setSelectedCab] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setBookingDetails((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [isAuthenticated, user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Search params:", searchParams);

    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        from: searchParams.pickup.trim(),
        to: searchParams.drop.trim(),
        capacity: searchParams.passengers,
      });

      console.log(
        "Making request to:",
        `${process.env.NEXT_PUBLIC_API_URL}/cabs/available?${queryParams}`
      );

      // Make API call to fetch available cabs
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cabs/available?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Add credentials if using cookies/sessions
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cabs");
      }

      if (!data || !data.data || !data.data.cabs) {
        throw new Error("Invalid response format from server");
      }

      // Transform the data to match the expected format
      const formattedCabs = data.data.cabs.map((cab) => ({
        id: cab._id || cab.id,
        name: cab.name,
        type: cab.type,
        capacity: cab.capacity,
        pricePerKm: cab.pricePerKm,
        baseFare: cab.baseFare || 100,
        rating: cab.rating || 4.5,
        image: cab.image || cab.images?.[0] || "/images/cabs/default.png",
        ac: cab.ac || cab.features?.includes("AC") || false,
        features: cab.features || [],
        registrationNumber: cab.registrationNumber,
        driver: cab.driver,
      }));

      console.log("Formatted cabs:", formattedCabs);
      setCabs(formattedCabs);
    } catch (error) {
      console.error("Error fetching cabs:", error);
      alert(`Error: ${error.message}`);
      setCabs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = useCallback(
    (cab) => {
      if (!isAuthenticated) {
        // Redirect to login page with return URL
        router.push(
          `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }
      setSelectedCab(cab);
      setShowBookingForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [isAuthenticated, router]
  );

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !bookingDetails.name ||
        !bookingDetails.email ||
        !bookingDetails.phone
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Basic email validation
      const bookingData = {
        cab: selectedCab.id,
        pickupLocation: {
          address: searchParams.pickup,
          name: searchParams.pickup,
          contactNumber: bookingDetails.phone,
        },
        dropoffLocation: {
          address: searchParams.drop,
          name: searchParams.drop,
        },
        pickupTime: new Date(`${searchParams.date}T${searchParams.time}`).toISOString(),
        distance: 10, // TODO: Calculate actual distance using a mapping service
        passengerName: bookingDetails.name,
        passengerEmail: bookingDetails.email,
        passengerPhone: bookingDetails.phone,
        specialRequests: bookingDetails.specialRequests,
        paymentMethod: "cash",
        totalAmount: calculateFare(10),
      };

      // Use the fetchAPI utility which handles authentication automatically
      const response = await fetchAPI(`${process.env.NEXT_PUBLIC_API_URL}/cabs/bookings`, 'POST', bookingData);

      if (response && response.status === 'success') {
        // Show success message
        toast.success("Booking created successfully!");

        // Reset form
        setShowBookingForm(false);
        setSelectedCab(null);
        setBookingDetails({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          specialRequests: "",
        });

        // Redirect to booking details page
        router.push(`/bookings/${response.data.booking._id}`);
      } else {
        throw new Error(response?.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.message || "Failed to create booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateFare = (distance) => {
    if (!selectedCab) return 0;
    const distanceKm = parseFloat(distance) || 10; // Default 10km if distance not provided
    return selectedCab.baseFare + selectedCab.pricePerKm * distanceKm;
  };

  // Render login/register prompt if not authenticated
  const renderAuthPrompt = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            You need to be logged in to book a cab.
            <a
              href="/login"
              className="font-medium text-yellow-700 underline hover:text-yellow-600 ml-1"
            >
              Log in
            </a>{" "}
            or
            <a
              href="/register"
              className="font-medium text-yellow-700 underline hover:text-yellow-600 ml-1"
            >
              create an account
            </a>{" "}
            to continue.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      {/* Floating Search Card */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <FloatingSearchCard />
      </div>

      {/* Hero Section with Search */}
      <div className="pt-26 pb-8">
        {/* Floating Search Card */}
        <div className="max-w-7xl mx-auto">
          <CabSearchForm
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSubmit={handleSearch}
            loading={loading}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        {authLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--logo-color)]"></div>
            <span className="ml-4">Loading user session...</span>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--logo-color)]"></div>
            <span className="ml-4">Finding available cabs...</span>
          </div>
        ) : cabs.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Available Cabs</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort by:</span>
                <select className="border rounded px-3 py-1 text-sm bg-[var(--container-color-in)] cursor-pointer">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {!isAuthenticated && renderAuthPrompt()}

              {cabs.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No cabs available
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search criteria or check back later.
                  </p>
                </div>
              ) : (
                cabs.map((cab) => (
                  <CabCard
                    key={cab.id}
                    cab={cab}
                    onBookNow={handleBookNow}
                    distance={10} // TODO: Calculate actual distance
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Search for cabs</h3>
            <p className="text-gray-500">
              Enter your journey details to find available cabs
            </p>
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedCab && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-[var(--container-color)] rounded-lg shadow-lg w-full max-w-2xl px-6 py-4 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 text-center text-[var(--logo-color)]">
              Proceed to Booking
            </h2>

            {/* Cab Summary Card */}
            <div className="mb-6 bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-color)]">
                      {selectedCab.name}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedCab.type}</p>
                    <div className="mt-1 flex items-center text-xs text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1">{selectedCab.rating}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="ml-1">{selectedCab.capacity} seats</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-[var(--logo-color)]">
                    ₹{calculateFare(10)}
                  </p>
                  <p className="text-xs text-gray-500">for 10 km</p>
                </div>
              </div>

              {/* Route */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Pickup</p>
                    <p className="text-xs text-gray-500">
                      {searchParams.pickup}
                    </p>
                  </div>
                </div>

                <div className="ml-4 pl-6 border-l-2 border-gray-200 h-4"></div>

                <div className="flex items-center mt-3">
                  <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Drop-off</p>
                    <p className="text-xs text-gray-500">{searchParams.drop}</p>
                  </div>
                </div>
              </div>

              {/* Date, Time & Passengers */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-gray-500">
                    {new Date(searchParams.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {searchParams.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Passengers</p>
                  <p className="text-gray-500">
                    {searchParams.passengers}{" "}
                    {searchParams.passengers === 1 ? "person" : "people"}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bookingDetails.name}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--container-color-in)] focus:ring-2 focus:ring-[var(--logo-color)] focus:outline-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingDetails.email}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--container-color-in)] focus:ring-2 focus:ring-[var(--logo-color)] focus:outline-none"
                    disabled={isSubmitting || isAuthenticated}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingDetails.phone}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--container-color-in)] focus:ring-2 focus:ring-[var(--logo-color)] focus:outline-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows="3"
                  value={bookingDetails.specialRequests}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      specialRequests: e.target.value,
                    })
                  }
                  placeholder="E.g., Child seat, extra luggage, etc."
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--container-color-in)] focus:ring-2 focus:ring-[var(--logo-color)] focus:outline-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Fare Summary */}
              <div className="mt-6 border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>₹{selectedCab.baseFare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance (10 km)</span>
                  <span>₹{(selectedCab.pricePerKm * 10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[var(--logo-color)]">
                    ₹{calculateFare(10)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row-reverse sm:justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex justify-center items-center px-6 py-3 rounded-md text-[var(--button-color)] font-medium bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 border border-[var(--border-color)] rounded-md font-medium hover:bg-[var(--container-color-in)] transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-500 text-center">
                By confirming this booking, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-[var(--logo-color)] hover:underline"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-[var(--logo-color)] hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
