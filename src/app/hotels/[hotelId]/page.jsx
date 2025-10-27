'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getHotelDetails } from '@/services/hotelService';
import { format } from 'date-fns';

export default function HotelDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const hotelId = params.hotelId;
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = searchParams.get('adults') || 2;
  const children = searchParams.get('children') || 0;

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        const data = await getHotelDetails({
          hotelCode: hotelId,
          checkIn,
          checkOut,
          guests: {
            adults: parseInt(adults),
            children: parseInt(children)
          }
        });
        setHotel(data);
      } catch (err) {
        setError('Failed to load hotel details');
        console.error('Error fetching hotel details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotelDetails();
    }
  }, [hotelId, checkIn, checkOut, adults, children]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-4xl mx-auto my-8">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">Hotel not found</h2>
        <p className="mt-2 text-gray-500">The requested hotel could not be found.</p>
      </div>
    );
  }

  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hotel Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.HotelName}</h1>
        <div className="flex items-center text-gray-600 text-sm">
          <span className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {hotel.StarRating || 'N/A'}
          </span>
          <span className="mx-2">•</span>
          <span>{hotel.HotelAddress}</span>
        </div>
      </div>

      {/* Hotel Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-3 h-96 rounded-lg overflow-hidden">
          <Image
            src={hotel.HotelPicture || '/images/hotel-placeholder.jpg'}
            alt={hotel.HotelName}
            width={1200}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-lg overflow-hidden">
              <Image
                src={`/images/hotel-${i}.jpg`}
                alt={`${hotel.HotelName} view ${i}`}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hotel Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About this property</h2>
            <p className="text-gray-700 mb-4">
              {hotel.Description || 'No description available for this property.'}
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Hotel Facilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hotel.HotelFacilities?.map((facility, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{facility}</span>
                </div>
              )) || (
                <p className="text-gray-500">No facilities information available.</p>
              )}
            </div>
          </div>

          {/* Room Types */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Available Rooms</h2>
            
            {hotel.Rooms?.length > 0 ? (
              <div className="space-y-6">
                {hotel.Rooms.map((room, index) => (
                  <div key={index} className={`border rounded-lg overflow-hidden ${selectedRoom?.RoomTypeCode === room.RoomTypeCode ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}>
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{room.RoomTypeName}</h3>
                          <p className="text-sm text-gray-600 mt-1">Max guests: {room.MaxOccupancy}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">
                            ${room.Rate?.NightlyRate?.toFixed(2) || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">per night</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Room Amenities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.Amenities?.slice(0, 5).map((amenity, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          onClick={() => setSelectedRoom(room)}
                          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {selectedRoom?.RoomTypeCode === room.RoomTypeCode ? 'Selected' : 'Select Room'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No room information available.</p>
            )}
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:sticky lg:top-4 h-fit">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Your Stay</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Check-in</p>
                  <p className="text-sm text-gray-600">{format(new Date(checkIn), 'EEE, MMM d, yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Check-out</p>
                  <p className="text-sm text-gray-600">{format(new Date(checkOut), 'EEE, MMM d, yyyy')}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="font-medium">Guests</p>
                <p className="text-sm text-gray-600">
                  {adults} {adults === 1 ? 'Adult' : 'Adults'}{children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
                </p>
              </div>
              
              {selectedRoom && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium mb-2">Selected Room</h3>
                    <p className="text-sm">{selectedRoom.RoomTypeName}</p>
                    <p className="text-sm text-gray-600">Max guests: {selectedRoom.MaxOccupancy}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-2">
                      <span>${selectedRoom.Rate?.NightlyRate?.toFixed(2)} x {nights} nights</span>
                      <span>${(selectedRoom.Rate?.NightlyRate * nights).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2 mt-2">
                      <span>Total</span>
                      <span>${(selectedRoom.Rate?.NightlyRate * nights).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-200">
                    Book Now
                  </button>
                </>
              )}
              
              {!selectedRoom && (
                <div className="text-center py-4 text-gray-500">
                  Please select a room to continue
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="font-semibold mb-2">Need help with your booking?</h3>
            <p className="text-sm text-gray-600 mb-4">Our customer service team is available 24/7 to assist you.</p>
            <div className="flex items-center text-blue-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
