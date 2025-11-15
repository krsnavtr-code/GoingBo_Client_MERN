import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
console.log("🔥 flightService.js LOADED!!");

// Helper function to format flight data - moved to top to avoid hoisting issues
function formatFlightData(flight, segment, searchParams = {}) {
  console.log('Formatting flight data:', { 
    flight: flight ? 'exists' : 'null', 
    segment: segment ? 'exists' : 'null',
    flightKeys: flight ? Object.keys(flight) : [],
    segmentKeys: segment ? Object.keys(segment) : []
  });

  // Calculate duration if we have both departure and arrival times
  let duration = '';
  let durationInMinutes = 0;

  // Handle different segment formats
  const origin = segment?.Origin || segment?.OriginLocation || {};
  const destination = segment?.Destination || segment?.DestinationLocation || {};
  const depTime = origin.DepTime || origin.DepartureTime || '';
  const arrTime = destination.ArrTime || destination.ArrivalTime || '';

  if (depTime && arrTime) {
    try {
      const depDate = new Date(depTime);
      const arrDate = new Date(arrTime);
      if (!isNaN(depDate.getTime()) && !isNaN(arrDate.getTime())) {
        durationInMinutes = Math.round((arrDate - depDate) / (1000 * 60));
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        duration = `${hours}h ${minutes}m`;
      }
    } catch (e) {
      console.error('Error calculating duration:', e);
    }
  }

  // Get airline information
  const airline = flight.Airline || {};
  const fare = flight.Fare || {};

  // Handle airport codes - check both possible locations
  const originAirportCode = origin.Airport?.AirportCode || origin.AirportCode || searchParams.origin || '';
  const destAirportCode = destination.Airport?.AirportCode || destination.AirportCode || searchParams.destination || '';

  return {
    id: flight.ResultIndex || `${airline.FlightNumber || 'FLT'}-${Date.now()}`,
    airline: {
      code: airline.AirlineCode || '',
      name: airline.AirlineName || 'Unknown Airline',
      number: airline.FlightNumber || '',
      logo: `https://www.gstatic.com/flights/airline_logos/70px/${(airline.AirlineCode || 'default').toLowerCase()}.png`
    },
    origin: originAirportCode,
    destination: destAirportCode,
    departureTime: depTime || new Date().toISOString(),
    arrivalTime: arrTime || new Date().toISOString(),
    duration,
    durationInMinutes,
    stops: segment?.StopQuantity || 0,
    aircraftType: segment?.Equipment || segment?.AircraftType || 'N/A',
    fare: {
      baseFare: fare.PublishedFare || 0,
      tax: fare.Tax || 0,
      totalFare: (fare.PublishedFare || 0) + (fare.Tax || 0),
      currency: searchParams.currency || 'INR'
    },
    cabinClass: searchParams.cabinClass || 'Economy',
    bookingClass: segment?.BookingClass || '',
    fareType: fare.FareType || 'PUBLISHED',
    baggage: fare.ChargeableBaggage || 'Check Fare Rules',
    refundable: fare.Refundable || false,
    amenities: {
      wifi: fare.IsWifiAvailable || false,
      meals: fare.IsMealAvailable || false,
      entertainment: fare.IsEntertainmentAvailable || false
    },
    segments: [segment],
    ...searchParams
  };
};

// Singleton instance
let instance = null;

class FlightService {
  constructor() {
    // Enforce singleton pattern
    if (instance) {
      return instance;
    }
    instance = this;

    // Initialize axios instance
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || error.message);
      }
    );
  }

  async searchFlights(searchParams) {
    try {
      // Define cabin class mapping
      const cabinClassMap = {
        'Economy': 2,
        'Premium Economy': 3,
        'Business': 4,
        'First': 6
      };

      // Format date to YYYY-MM-DD format
      const formatDate = (dateString) => {
        try {
          if (!dateString) return '';
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        } catch (e) {
          console.error('Error formatting date:', e);
          return '';
        }
      };

      // Validate required parameters
      if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
        throw new Error('Missing required search parameters');
      }

      // Transform data to match backend format
      const formattedParams = {
        origin: String(searchParams.origin).toUpperCase(),
        destination: String(searchParams.destination).toUpperCase(),
        journey_type: searchParams.tripType === 'roundtrip' ? 2 : 1,
        adult: parseInt(searchParams.adults) || 1,
        child: parseInt(searchParams.children) || 0,
        infant: parseInt(searchParams.infants) || 0,
        travelclass: cabinClassMap[searchParams.cabinClass] || 2,
        departureDate: formatDate(searchParams.departureDate),
        directFlight: Boolean(searchParams.directFlight),
        oneStopFlight: Boolean(searchParams.oneStopFlight)
      };

      // Add return date for round trips
      if (searchParams.tripType === 'roundtrip' && searchParams.returnDate) {
        formattedParams.returnDate = formatDate(searchParams.returnDate);
      }

      console.log('Sending search request:', formattedParams);
      const response = await this.api.post('/flights/search', formattedParams);

      // Add detailed response logging
      console.group('API Response Details');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data type:', typeof response.data);
      console.log('Response data length:', response.data ? JSON.stringify(response.data).length : 0);
      console.log('First 500 chars of response:', JSON.stringify(response.data).substring(0, 500));
      console.groupEnd();

      // Handle different response formats
      let results = [];
      let responseData = response?.data || {};

      // Add logging for response data structure
      console.log('Response data structure:', Object.keys(responseData));

      // If response has a Response property, use that (TBO format)
      if (responseData?.Response) {
        responseData = responseData.Response;
      }

      // Check for error in response
      if (responseData?.IsError) {
        const errorMessage = responseData.Error?.ErrorMessage || 'Error fetching flights';
        throw new Error(errorMessage);
      }

      // Extract results based on different possible response formats
      if (Array.isArray(responseData)) {
        results = responseData;
      } else if (responseData?.Results) {
        results = Array.isArray(responseData.Results)
          ? responseData.Results.flat()
          : [responseData.Results];
      } else if (responseData?.data) {
        results = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
      } else if (responseData) {
        results = [responseData];
      }

      // If no results found, return empty array
      if (!results || results.length === 0) {
        console.warn('No flight results found in response');
        return [];
      }

      // ---- Replace the current Results processing with this robust block ----
      const formattedFlights = [];

      try {
        if (!Results) {
          console.warn('No Results returned from backend', response.data);
        } else {
          // Log a small sample to inspect real structure (remove in production)
          console.debug('Results sample (first item):', Results[0]);

          // Normalise possible segment shapes into an iterable array of segments
          const normalizeSegments = (segments) => {
            // segments could be:
            // 1) undefined/null
            // 2) [ {Origin, Destination, ...}, { ... } ]  (simple array)
            // 3) [ [ {Origin...} ] ]  (nested array)
            // 4) [ [ [ ... ] ] ]  (rare deeply nested)
            if (!segments) return [];
            // flatten only arrays of arrays into depth 2 arrays of objects
            if (!Array.isArray(segments)) return [];
            // If first element is an array, flatten one level
            if (Array.isArray(segments[0])) {
              // segments = [ [segObj, segObj], [ ... ] ] -> flatten to array of segObjs
              return segments.flat(2).filter(Boolean);
            }
            // Already array of objects
            return segments.filter(Boolean);
          };

          // Iterate safely over Results (which itself is often nested)
          for (const resultItem of Results) {
            if (!resultItem) continue;

            // resultItem sometimes itself is an array of flights
            const flightsArray = Array.isArray(resultItem) ? resultItem : [resultItem];

            for (const flight of flightsArray) {
              if (!flight) continue;

              // Normalize Segments into flat array of segment objects
              const rawSegments = normalizeSegments(flight.Segments);

              // If still empty, try to dig deeper (defensive)
              if (rawSegments.length === 0 && Array.isArray(flight.Segments)) {
                // attempt to flatten any nested arrays up to depth 3
                const deepFlat = JSON.parse(JSON.stringify(flight.Segments)).flat(3);
                rawSegments.push(...deepFlat.filter(s => s && s.Origin && s.Destination));
              }

              // For each actual segment object, format
              for (const segment of rawSegments) {
                try {
                  if (!segment || !segment.Origin || !segment.Destination) continue;
                  const formattedFlight = formatFlightData(flight, segment, searchParams);
                  formattedFlights.push(formattedFlight);
                } catch (segErr) {
                  // Protect whole flow from one bad segment
                  console.warn('Error formatting a segment — skipping it', segErr, segment);
                  continue;
                }
              }
            }
          }
        }
      } catch (outerErr) {
        console.error('Unexpected error while processing Results:', outerErr);
        // Return whatever we collected so far instead of throwing a TDZ/minify error
        return formattedFlights;
      }

      // Return final array
      return formattedFlights;


      console.log(`Formatted ${formattedFlights.length} flights`);
      return formattedFlights;
    } catch (error) {
      console.error('Search flights error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        throw new Error(error.response.data?.message || 'Failed to search flights');
      }
      throw new Error(error.message || 'Failed to search flights');
    }
  }

  async getFareRules(sessionId, resultIndex) {
    try {
      const response = await this.api.post('/flights/fare-rules', { sessionId, resultIndex });
      return response.data;
    } catch (error) {
      console.error('Get fare rules error:', error);
      throw error;
    }
  }

  async bookFlight(bookingData) {
    try {
      const response = await this.api.post('/flights/book', bookingData);
      return response.data;
    } catch (error) {
      console.error('Book flight error:', error);
      throw error;
    }
  }

  async getBookingDetails(bookingId) {
    try {
      const response = await this.api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Get booking details error:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId) {
    try {
      const response = await this.api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  }
}

// Create and export the service instance
const flightService = new FlightService();

// Export the instance as default
export default flightService;

// Export individual methods with proper binding
// export const searchFlights = flightService.searchFlights.bind(flightService);
export const getFareRules = flightService.getFareRules.bind(flightService);
export const bookFlight = flightService.bookFlight.bind(flightService);
export const getBookingDetails = flightService.getBookingDetails.bind(flightService);
export const cancelBooking = flightService.cancelBooking.bind(flightService);
