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
  const [sortBy, setSortBy] = useState('price_asc');

  const toggleFlightDetails = (flightId) => {
    setSelectedFlight(selectedFlight === flightId ? null : flightId);
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '--:--';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '--:--';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return '';
    }
  };

  const handleSelectFlight = (flight) => {
    if (tripType === 'roundtrip') {
      // For round trips, we need to select both outbound and return flights
      if (!selectedOutbound) {
        setSelectedOutbound(flight);
      } else if (!selectedReturn && flight.id !== selectedOutbound.id) {
        setSelectedReturn(flight);
        if (onSelectFlight) {
          onSelectFlight({
            outbound: selectedOutbound,
            return: flight
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

  // Sort flights based on the selected criteria
  const sortedFlights = [...(flights || [])].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return (a.fare?.totalFare || 0) - (b.fare?.totalFare || 0);
      case 'price_desc':
        return (b.fare?.totalFare || 0) - (a.fare?.totalFare || 0);
      case 'duration':
        return (a.durationInMinutes || 0) - (b.durationInMinutes || 0);
      case 'departure':
        return new Date(a.departureTime) - new Date(b.departureTime);
      default:
        return 0;
    }
  });

  if (!flights || flights.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow p-6">
        <Plane className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No flights found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  const renderAmenities = (amenities) => (
    <div className="flex items-center space-x-2 mt-2">
      {amenities.wifi && <Wifi className="h-4 w-4 text-blue-500" title="WiFi" />}
      {amenities.meals && <Utensils className="h-4 w-4 text-green-500" title="Meals" />}
      {amenities.entertainment && <Film className="h-4 w-4 text-purple-500" title="Entertainment" />}
      {amenities.baggage && <Luggage className="h-4 w-4 text-amber-500" title="Baggage included" />}
    </div>
  );

  const renderFlightCard = (flight, isSelected = false, isReturn = false) => (
    <div 
      key={`${flight.id}-${isReturn ? 'return' : 'outbound'}`}
      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 hover:border-blue-300'
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
                  {flight.airline} • {flight.flightNumber}
                </div>
                <div className="text-xs text-gray-500">{flight.aircraftType}</div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(flight.fare?.totalFare || 0, flight.fare?.currency)}
            </div>
            <div className="text-xs text-gray-500">
              {flight.fareType} • {flight.refundable ? 'Refundable' : 'Non-refundable'}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold">{formatTime(flight.departureTime)}</div>
            <div className="text-sm text-gray-500">{flight.origin}</div>
            <div className="text-xs text-gray-400">{formatDate(flight.departureTime)}</div>
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
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</div>
            <div className="text-sm text-gray-500">{flight.destination}</div>
            <div className="text-xs text-gray-400">{formatDate(flight.arrivalTime)}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-500">Baggage: {flight.baggage || 'Check Fare Rules'}</div>
              {flight.amenities && renderAmenities(flight.amenities)}
            </div>
            <button
              onClick={() => handleSelectFlight(flight)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isSelected 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSelected ? (
                <span className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Selected
                </span>
              ) : (
                'Select Flight'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Sorting and filtering controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-600">
            Showing {sortedFlights.length} {sortedFlights.length === 1 ? 'flight' : 'flights'}
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="duration">Duration (Shortest)</option>
              <option value="departure">Departure (Earliest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flight list */}
      <div className="space-y-4">
        {tripType === 'roundtrip' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Outbound Flights</h3>
            <div className="space-y-4">
              {sortedFlights
                .filter(flight => !flight.isReturn)
                .map(flight => renderFlightCard(flight, selectedOutbound?.id === flight.id, false))}
            </div>
          </div>
        )}

        {tripType === 'roundtrip' && selectedOutbound && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Return Flights</h3>
            <div className="space-y-4">
              {sortedFlights
                .filter(flight => flight.isReturn)
                .map(flight => renderFlightCard(flight, selectedReturn?.id === flight.id, true))}
            </div>
          </div>
        )}

        {tripType !== 'roundtrip' && sortedFlights.map(flight => 
          renderFlightCard(flight, selectedOutbound?.id === flight.id, false)
        )}
      </div>
    </div>
  );
       
}
