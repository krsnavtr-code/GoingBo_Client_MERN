import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHotelDetails } from "../../services/hotelService";

const HotelResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);

  useEffect(() => {
    if (location.state?.hotels) {
      setHotels(location.state.hotels);
      setLoading(false);
    } else {
      setError("No search results found. Please try your search again.");
      setLoading(false);
    }
  }, [location]);

  const handleViewDetails = async (hotel) => {
    try {
      setSelectedHotel(hotel);
      setLoading(true);
      const details = await getHotelDetails(
        hotel.HotelCode,
        location.state.searchParams.checkIn,
        location.state.searchParams.checkOut
      );
      setHotelDetails(details);
    } catch (err) {
      setError("Failed to load hotel details");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Hotels</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {hotels.map((hotel) => (
            <div
              key={hotel.HotelCode}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-4">
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
                  <div className="w-2/3 pl-4">
                    <h3 className="text-lg font-semibold">{hotel.HotelName}</h3>
                    <p className="text-gray-600 text-sm">
                      {hotel.HotelAddress}
                    </p>
                    <div className="mt-2">
                      <span className="text-yellow-500">
                        ★ {hotel.StarRating || "N/A"}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {hotel.TripAdvisorRating
                          ? `(${hotel.TripAdvisorRating}/5)`
                          : ""}
                      </span>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => handleViewDetails(hotel)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details & Rooms
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedHotel && hotelDetails && (
          <div className="md:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-3">Hotel Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Description:</h4>
                  <p className="text-sm text-gray-700">
                    {hotelDetails.Description || "No description available."}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Facilities:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {hotelDetails.HotelFacilities?.map((facility, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-xs px-2 py-1 rounded"
                      >
                        {facility}
                      </span>
                    )) || "No facilities listed."}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Contact:</h4>
                  <p className="text-sm text-gray-700">
                    {hotelDetails.Address}
                    <br />
                    Phone: {hotelDetails.PhoneNumber || "N/A"}
                    <br />
                    Email: {hotelDetails.Email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelResults;
