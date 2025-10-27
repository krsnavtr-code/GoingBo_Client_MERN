import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { preBookHotel, bookHotel } from "../../services/hotelService";

const HotelBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preBookData, setPreBookData] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const { hotel, room, searchParams } = location.state || {};

  useEffect(() => {
    if (!hotel || !room || !searchParams) {
      navigate("/hotels");
    }
  }, [hotel, room, searchParams, navigate]);

  const handlePreBook = async () => {
    try {
      setLoading(true);
      setError(null);

      const preBookParams = {
        // Add necessary parameters for pre-booking
        // This should match your API requirements
        hotelCode: hotel.HotelCode,
        roomTypeCode: room.RoomTypeCode,
        ratePlanCode: room.RatePlanCode,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        guests: searchParams.guests,
        rooms: searchParams.rooms,
      };

      const result = await preBookHotel(preBookParams);
      setPreBookData(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to pre-book hotel");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    try {
      setLoading(true);
      setError(null);

      const bookingDetails = {
        preBookData,
        guestInfo,
        // Add any additional booking details
      };

      const result = await bookHotel(bookingDetails);
      navigate("/booking-confirmation", {
        state: {
          bookingId: result.bookingId,
          hotel,
          checkIn: searchParams.checkIn,
          checkOut: searchParams.checkOut,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete booking");
    } finally {
      setLoading(false);
    }
  };

  if (!hotel || !room) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Guest Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <select
                  value={guestInfo.title}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name*
                </label>
                <input
                  type="text"
                  value={guestInfo.firstName}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, firstName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name*
                </label>
                <input
                  type="text"
                  value={guestInfo.lastName}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, lastName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone*
                </label>
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, phone: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                value={guestInfo.specialRequests}
                onChange={(e) =>
                  setGuestInfo({
                    ...guestInfo,
                    specialRequests: e.target.value,
                  })
                }
                rows="3"
                className="w-full p-2 border rounded"
                placeholder="Any special requests or requirements"
              ></textarea>
            </div>
          </div>

          {!preBookData ? (
            <button
              onClick={handlePreBook}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Check Availability & Price"}
            </button>
          ) : (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Room is available! Proceed to book now.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleBookNow}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? "Booking..." : "Book Now"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{hotel.HotelName}</h3>
                <p className="text-sm text-gray-600">{hotel.HotelAddress}</p>
                <div className="mt-1">
                  <span className="text-yellow-500">
                    ★ {hotel.StarRating || "N/A"}
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">
                    {new Date(searchParams.checkIn).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">
                    {new Date(searchParams.checkOut).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights:</span>
                  <span className="font-medium">
                    {Math.ceil(
                      (new Date(searchParams.checkOut) -
                        new Date(searchParams.checkIn)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Room Type:</h4>
                <p className="text-sm">
                  {room.RoomTypeName || "Standard Room"}
                </p>

                {preBookData && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Room Price:</span>
                      <span>${(preBookData.roomRate || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total:</span>
                      <span>${(preBookData.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;
