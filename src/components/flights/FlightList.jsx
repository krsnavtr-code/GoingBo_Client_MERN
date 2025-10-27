'use client';

import { useState } from 'react';
import { Clock, Plane, ArrowRight, ChevronDown, ChevronUp, DollarSign, Users, Briefcase, PlusCircle } from 'lucide-react';

export default function FlightList({ flights }) {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showFareRules, setShowFareRules] = useState(false);
  const [selectedFare, setSelectedFare] = useState(null);

  const toggleFlightDetails = (flightId) => {
    setSelectedFlight(selectedFlight === flightId ? null : flightId);
  };

  const formatTime = (dateTimeString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleTimeString([], options);
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    const [hours, minutes] = duration.split('h ').map(part => parseInt(part));
    if (isNaN(hours) || isNaN(minutes)) return duration;
    return `${hours}h ${minutes}m`;
  };

  const handleSelectFlight = (flight) => {
    setSelectedFare(flight);
    // Here you would typically navigate to the booking page or open a booking modal
    console.log('Selected flight:', flight);
  };

  if (!flights || flights.length === 0) {
    return (
      <div className="text-center py-12">
        <Plane className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No flights found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <div key={flight.result_index} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Plane className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {flight.airline} {flight.flight_number}
                    </div>
                    <div className="text-sm text-gray-500">{flight.aircraft_type || 'Boeing 737'}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 text-center">
                <div className="text-lg font-medium">
                  {formatTime(flight.departure_time)}
                </div>
                <div className="text-sm text-gray-500">
                  {flight.origin}
                </div>
              </div>
              
              <div className="flex-1 text-center">
                <div className="text-sm text-gray-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(flight.duration)}
                </div>
                <div className="h-px bg-gray-200 my-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-xs text-gray-500">
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-blue-600">
                  {flight.layovers?.length > 0 ? `${flight.layovers.length} ${flight.layovers.length === 1 ? 'layover' : 'layovers'}` : 'Direct'}
                </div>
              </div>
              
              <div className="flex-1 text-center">
                <div className="text-lg font-medium">
                  {formatTime(flight.arrival_time)}
                </div>
                <div className="text-sm text-gray-500">
                  {flight.destination}
                </div>
              </div>
              
              <div className="flex-1 text-right">
                <div className="text-xl font-bold text-blue-600">
                  ${flight.price?.total?.toFixed(2) || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {flight.price?.base ? `Base: $${flight.price.base.toFixed(2)}` : ''}
                </div>
                <div className="text-xs text-gray-500">
                  {flight.price?.taxes ? `Taxes: $${flight.price.taxes.toFixed(2)}` : ''}
                </div>
              </div>
              
              <div className="ml-4">
                <button
                  onClick={() => toggleFlightDetails(flight.result_index)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  {selectedFlight === flight.result_index ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {selectedFlight === flight.result_index && (
            <div className="bg-gray-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Flight Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Departure:</span>
                      <span className="font-medium">
                        {new Date(flight.departure_time).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Arrival:</span>
                      <span className="font-medium">
                        {new Date(flight.arrival_time).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{formatDuration(flight.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Aircraft:</span>
                      <span className="font-medium">{flight.aircraft_type || 'Boeing 737'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cabin Class:</span>
                      <span className="font-medium capitalize">{flight.cabin_class?.toLowerCase() || 'economy'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Fare Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Base Fare:</span>
                      <span className="font-medium">${flight.price?.base?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Taxes & Fees:</span>
                      <span className="font-medium">${flight.price?.taxes?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                      <span className="text-gray-900 font-medium">Total Price:</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${flight.price?.total?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => setShowFareRules(!showFareRules)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        {showFareRules ? 'Hide' : 'View'} fare rules
                        {showFareRules ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                      </button>
                      
                      {showFareRules && (
                        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-md text-xs text-gray-600">
                          {flight.fare_rules || 'Fare rules not available'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleSelectFlight(flight)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                  Select Flight
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
