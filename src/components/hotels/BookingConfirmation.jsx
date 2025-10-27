import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHotelBookingDetails } from "../../services/hotelService";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [booking, setBooking] = React.useState(null);

  const { bookingId, hotel, checkIn, checkOut } = location.state || {};

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        navigate("/hotels");
        return;
      }

      try {
        const bookingDetails = await getHotelBookingDetails(bookingId);
        setBooking(bookingDetails);
      } catch (err) {
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-600 text-white p-6">
          <div className="flex items-center">
            <svg
              className="h-12 w-12 text-white mr-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
              <p className="text-green-100">
                Thank you for your booking. Your reservation is now confirmed.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {booking && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Booking Reference:</p>
                  <p className="font-medium">{booking.bookingId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status:</p>
                  <p className="font-medium text-green-600">Confirmed</p>
                </div>
                <div>
                  <p className="text-gray-600">Check-in:</p>
                  <p className="font-medium">
                    {new Date(checkIn).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Check-out:</p>
                  <p className="font-medium">
                    {new Date(checkOut).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Hotel Information</h2>
            {hotel && (
              <div className="flex">
                <div className="w-1/3">
                  <img
                    src={
                      hotel.HotelPicture ||
                      "https://via.placeholder.com/300x200"
                    }
                    alt={hotel.HotelName}
                    className="w-full h-40 object-cover rounded"
                  />
                </div>
                <div className="w-2/3 pl-6">
                  <h3 className="text-lg font-semibold">{hotel.HotelName}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {hotel.HotelAddress}
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">
                      ★ {hotel.StarRating || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Check your email</h3>
                  <p className="text-gray-600 mt-1">
                    We've sent a confirmation email with all the details of your
                    booking.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Check-in information</h3>
                  <p className="text-gray-600 mt-1">
                    Check-in time is from 2:00 PM. Please bring a valid ID and
                    this confirmation.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Need help?</h3>
                  <p className="text-gray-600 mt-1">
                    Contact our customer service at{" "}
                    <a
                      href="tel:+1234567890"
                      className="text-blue-600 hover:underline"
                    >
                      +1 (234) 567-890
                    </a>{" "}
                    or email us at{" "}
                    <a
                      href="mailto:support@example.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@example.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                  clipRule="evenodd"
                />
              </svg>
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
