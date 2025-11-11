'use client';

import { Car, Users, Star, MapPin, Clock } from 'lucide-react';

export default function CabCard({ cab, onBookNow, distance }) {
  const calculateFare = (distance) => {
    const distanceKm = parseFloat(distance) || 10; // Default to 10km if not provided
    return (cab.baseFare + (cab.pricePerKm * distanceKm)).toFixed(2);
  };

  return (
    <div className="bg-[var(--container-color-in)] rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Middle: Cab Info */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h3 className="text-lg font-semibold">{cab.name}</h3>
            <p className="text-sm text-[var(--text-color-light)]">{cab.type}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full mt-2 sm:mt-0">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-sm font-medium text-black">{cab.rating}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mt-2 flex flex-wrap gap-2">
          {cab.features.map((feature, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Capacity + ETA */}
        <div className="mt-3 flex items-center gap-4 text-sm text-[var(--text-color-light)]">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-[var(--text-color-light)]" />
            <span>{cab.capacity} Seats</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>
              ETA: {Math.ceil(distance * 2.5)}–{Math.ceil(distance * 3.5)} mins
            </span>
          </div>
        </div>
      </div>

      {/* Right: Price + Button */}
      <div className="flex flex-col items-end justify-between w-full sm:w-auto">
        <div className="text-right mb-2">
          <div className="text-2xl font-bold text-[var(--logo-color)]">
            ₹{calculateFare(distance)}
          </div>
          <div className="text-xs text-[var(--text-color-light)]">for {distance} km</div>
        </div>
        <button
          onClick={() => onBookNow(cab)}
          className="w-full sm:w-auto bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] text-[var(--button-color)] font-medium py-2 px-5 rounded-md transition-colors cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
