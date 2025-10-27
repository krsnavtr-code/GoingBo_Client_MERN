'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HotelList({ hotels = [], searchParams }) {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hotels found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hotels.map((hotel) => (
        <div key={hotel.HotelCode} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="md:flex">
            <div className="md:w-1/3 h-48 md:h-auto relative">
              <Image
                src={hotel.HotelPicture || '/images/hotel-placeholder.jpg'}
                alt={hotel.HotelName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{hotel.HotelName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{hotel.HotelAddress}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < (hotel.StarRating || 3) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {hotel.TripAdvisorRating && (
                      <span className="ml-2 text-sm text-gray-600">
                        ({hotel.TripAdvisorRating.toFixed(1)}/5)
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    ${hotel.MinRate?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">per night</div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-700 text-sm line-clamp-2">
                  {hotel.Description || 'No description available.'}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {hotel.HotelFacilities?.slice(0, 5).map((facility, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {facility}
                  </span>
                ))}
                {hotel.HotelFacilities?.length > 5 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{hotel.HotelFacilities.length - 5} more
                  </span>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href={`/hotels/${hotel.HotelCode}?checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&adults=${searchParams.guests.adults}&children=${searchParams.guests.children}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Details
                  <svg
                    className="ml-2 -mr-1 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
