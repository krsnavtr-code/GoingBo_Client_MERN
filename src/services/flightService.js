import axios from 'axios';
import { demoFlight } from '../demoFlightData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const USE_DEMO_ON_ERROR = true; // Set to false to disable demo data fallback
console.log("🔥 flightService.js LOADED!!");

// Helper function to format flight data - moved to top to avoid hoisting issues
function formatFlightData(flight, segment, searchParams = {}) {
  try {
    if (!flight || !segment) return null;

    const origin = segment.Origin || {};
    const destination = segment.Destination || {};

    // **** FIXED TIME KEYS FOR TBO ****
    const depTime =
      origin.DepTime || // TBO correct field
      origin.DepartureTime ||
      origin.DepartureDateTime ||
      '';

    const arrTime =
      destination.ArrTime || // TBO correct field
      destination.ArrivalTime ||
      destination.ArrivalDateTime ||
      '';

    // **** FIXED DURATION ****
    let duration = '';
    let durationInMinutes = segment.Duration || 0;

    if (durationInMinutes) {
      const h = Math.floor(durationInMinutes / 60);
      const m = durationInMinutes % 60;
      duration = `${h}h ${m}m`;
    }

    // **** FIXED AIRPORT CODES ****
    const originAirportCode =
      origin.Airport?.AirportCode ||
      origin.AirportCode ||
      searchParams.origin ||
      '';

    const destAirportCode =
      destination.Airport?.AirportCode ||
      destination.AirportCode ||
      searchParams.destination ||
      '';

    const airline = segment.Airline || flight.Airline || {};
    const fare = flight.Fare || {};

    const baseFare = fare.BaseFare || 0;
    const tax = fare.Tax || 0;
    const totalFare = fare.PublishedFare || baseFare + tax;

    return {
      id: flight.ResultIndex || `${airline.AirlineCode}-${Date.now()}`,
      airline: {
        code: airline.AirlineCode || '',
        name: airline.AirlineName || 'Unknown Airline',
        number: airline.FlightNumber || '',
        logo: `https://www.gstatic.com/flights/airline_logos/70px/${(airline.AirlineCode || 'default').toLowerCase()}.png`
      },

      // ORIGIN
      origin: originAirportCode,
      originInfo: {
        code: originAirportCode,
        city: origin.Airport?.CityName || '',
        airport: origin.Airport?.AirportName || '',
        terminal: origin.Airport?.Terminal || ''
      },

      // DESTINATION
      destination: destAirportCode,
      destinationInfo: {
        code: destAirportCode,
        city: destination.Airport?.CityName || '',
        airport: destination.Airport?.AirportName || '',
        terminal: destination.Airport?.Terminal || ''
      },

      // CORRECT TIME
      departureTime: depTime,
      arrivalTime: arrTime,

      duration,
      durationInMinutes,

      stops: segment.SegmentIndicator || segment.StopQuantity || 0,

      aircraftType: segment.Craft || segment.Equipment || 'N/A',

      fare: {
        baseFare,
        tax,
        totalFare,
        currency: fare.Currency || 'INR',
        refundable: flight.IsRefundable || false
      },

      cabinClass: segment.CabinClass || 'Economy',
      bookingClass: segment.SupplierFareClass || '',

      fareType: fare.FareType || flight.ResultFareType || 'RegularFare',

      baggage: segment.Baggage || fare.ChargeableBaggage || 'Check Fare Rules',

      amenities: {
        wifi: false,
        meals: false,
        entertainment: false
      },

      segments: [segment],
      rawData: { flight, segment }
    };

  } catch (err) {
    console.error("Error formatting flight:", err);
    return null;
  }
}


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
      console.log('Response data:', response.data);
      console.log('Response data length:', response.data ? JSON.stringify(response.data).length : 0);
      console.log('First 500 chars of response:', JSON.stringify(response.data).substring(0, 500));
      console.groupEnd();

      // Handle different response formats
      let results = [];
      let responseData = response?.data || {};

      // Add detailed logging of the full response structure
      console.log('Full response data structure:', JSON.stringify({
        hasSuccess: !!responseData?.success,
        hasData: !!responseData?.data,
        dataKeys: responseData?.data ? Object.keys(responseData.data) : [],
        hasDataData: !!responseData?.data?.data,
        hasResults: !!responseData?.data?.data?.results,
        resultsType: responseData?.data?.data?.results ?
          (Array.isArray(responseData.data.data.results) ? 'array' : typeof responseData.data.data.results) : 'none'
      }, null, 2));

      // Try to extract results from the deeply nested structure
      if (responseData?.data?.data?.results) {
        console.log('Found results in response.data.data.results');
        results = responseData.data.data.results;
      }
        // Fallback to other possible structures
      else if (responseData?.data?.results) {
        console.log('Found results in response.data.results');
        results = responseData.data.results;
      } 
      else if (responseData?.results) {
        console.log('Found results in response.results');
        results = responseData.results;
      }
      // If we have data directly in response
      else if (Array.isArray(responseData)) {
        console.log('Response is directly an array of results');
        results = responseData;
      }

      // Handle the case where results is an array of arrays (flatten it)
      if (Array.isArray(results) && results.length > 0 && Array.isArray(results[0])) {
        console.log('Flattening nested results array');
        results = results.flat();
      }

      // Ensure results is always an array
      if (!Array.isArray(results)) {
        results = results ? [results] : [];
      }

      // At this point, we should have results in the 'results' variable
      // Log the structure of the first result for debugging
      if (results.length > 0) {
        console.log('First result structure:',
          JSON.stringify(results[0], (key, value) =>
            key === 'Segments' ? '[...segments]' : value, 2).substring(0, 1000));
      }

      // If no results found, log the response structure for debugging
      if (!results || results.length === 0 || (results.length === 1 && !results[0])) {
        console.warn('No valid flight results found in response');
        console.log('Response data structure for debugging:', JSON.stringify(responseData, null, 2).substring(0, 1000));
        return [];
      }

      // Process the results
      const formattedFlights = [];
      const isRoundTrip = searchParams.tripType === 'roundtrip';
      const outboundFlights = [];
      const returnFlights = [];

      try {
        if (!results || results.length === 0) {
          console.warn('No results returned from backend', response.data);
          return isRoundTrip ? { outbound: [], return: [] } : [];
        } else {
          // Log a small sample to inspect real structure (remove in production)
          console.debug('Results sample (first item):', results[0]);

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

          // Iterate safely over results (which itself is often nested)
          for (const resultItem of results) {
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
                  // Validate segment before processing
                  if (!segment) {
                    console.warn('Skipping null/undefined segment');
                    continue;
                  }

                  // Log segment structure for debugging
                  console.debug('Processing segment:', {
                    segmentKeys: Object.keys(segment),
                    hasOrigin: !!segment.Origin,
                    hasDestination: !!segment.Destination,
                    originType: typeof segment.Origin,
                    destType: typeof segment.Destination,
                    origin: segment.Origin?.Airport?.AirportCode || segment.Origin?.AirportCode,
                    destination: segment.Destination?.Airport?.AirportCode || segment.Destination?.AirportCode,
                    departureDate: segment.Origin?.DepTime || segment.Origin?.DepartureTime,
                    arrivalDate: segment.Destination?.ArrTime || segment.Destination?.ArrivalTime
                  });

                  if (!segment.Origin || !segment.Destination) {
                    console.warn('Skipping segment with missing origin/destination:', {
                      origin: segment.Origin,
                      destination: segment.Destination,
                      segmentId: segment.SegmentId || 'unknown'
                    });
                    continue;
                  }

                  const formattedFlight = formatFlightData(flight, segment, searchParams);
                  if (formattedFlight) {
                    // For round-trip, check if this is an outbound or return flight
                    if (isRoundTrip) {
                      console.log('Checking flight direction:', {
                        flightOrigin: formattedFlight.origin,
                        flightDest: formattedFlight.destination,
                        searchOrigin: searchParams.origin,
                        searchDest: searchParams.destination,
                        isReturn: formattedFlight.origin === searchParams.destination &&
                          formattedFlight.destination === searchParams.origin
                      });

                      const isReturnFlight = 
                        formattedFlight.origin === searchParams.destination &&
                        formattedFlight.destination === searchParams.origin;

                      if (isReturnFlight) {
                        console.log('Found return flight:', formattedFlight);
                        returnFlights.push(formattedFlight);
                      } else {
                        console.log('Found outbound flight:', formattedFlight);
                        outboundFlights.push(formattedFlight);
                      }
                    } else {
                      formattedFlights.push(formattedFlight);
                    }
                  }
                } catch (segErr) {
                  // Protect whole flow from one bad segment
                  console.warn('Error formatting a segment — skipping it', {
                    error: segErr.message,
                    segment: segment ? {
                      id: segment.SegmentId,
                      origin: segment.Origin,
                      destination: segment.Destination
                    } : 'null/undefined',
                    flight: flight ? {
                      id: flight.ResultIndex || flight.id,
                      airline: flight.Airline || flight.airline
                    } : 'null/undefined'
                  });
                  continue;
                }
              }
            }
          }

          // For round-trip, check if we need to fetch return flights
          if (isRoundTrip) {
            console.log('Search parameters:', searchParams);

        // Check if return flights are in a different part of the response
        if (returnFlights.length === 0 && responseData?.data?.returnFlights) {
          console.log('Found return flights in response.data.returnFlights');
          const returnResults = responseData.data.returnFlights;
          // Process return flights
          for (const flight of Array.isArray(returnResults) ? returnResults : []) {
            const segments = this.normalizeSegments(flight.Segments);
            for (const segment of segments) {
              const formattedFlight = this.formatFlightData(flight, segment, {
                ...searchParams,
                origin: searchParams.destination,
                destination: searchParams.origin
              });
              if (formattedFlight) {
                returnFlights.push(formattedFlight);
              }
            }
          }
        }

        console.log(`Found ${outboundFlights.length} outbound and ${returnFlights.length} return flights`);

        // Log sample flights if available
        if (outboundFlights.length > 0) {
          console.log('Sample outbound flight:', {
            origin: outboundFlights[0].origin,
            destination: outboundFlights[0].destination,
            departureTime: outboundFlights[0].departureTime,
            flightNumber: outboundFlights[0].airline?.code + ' ' + outboundFlights[0].airline?.number
          });
        } else {
          console.warn('No outbound flights found for the selected dates');
        }

        if (returnFlights.length > 0) {
          console.log('Sample return flight:', {
            origin: returnFlights[0].origin,
            destination: returnFlights[0].destination,
            departureTime: returnFlights[0].departureTime,
            flightNumber: returnFlights[0].airline?.code + ' ' + returnFlights[0].airline?.number
          });
        } else if (searchParams.returnDate) {
          console.warn('No return flights found for the selected return date. You may need to make a separate API call.');
          console.log('To fetch return flights, you may need to make a separate API call with:', {
            origin: searchParams.destination,
            destination: searchParams.origin,
            departureDate: searchParams.returnDate,
            tripType: 'oneway'
          });
        }

            // If we have both outbound and return flights, create pairs
            if (outboundFlights.length > 0 && returnFlights.length > 0) {
              // For each outbound flight, find a matching return flight
              outboundFlights.forEach(outbound => {
                // Find return flights with the same airline first
                const matchingReturns = returnFlights.filter(ret =>
                  ret.airline.code === outbound.airline.code
                );

                // If no matching airline, use any return flight
                const returnFlight = matchingReturns.length > 0
                  ? matchingReturns[0]
                  : returnFlights[0];

                if (returnFlight) {
                  // Create a combined flight object
                  const roundTripFlight = {
                    ...outbound,
                    isRoundTrip: true,
                    returnFlight: returnFlight,
                    totalPrice: outbound.fare.totalFare + (returnFlight?.fare?.totalFare || 0),
                    // Add combined duration
                    totalDurationInMinutes: (outbound.durationInMinutes || 0) + (returnFlight.durationInMinutes || 0)
                  };
                  formattedFlights.push(roundTripFlight);
                }
              });
            } else if (outboundFlights.length > 0) {
              // If only outbound flights, still include them but mark as one-way
              console.warn('No return flights found for round-trip search');
              formattedFlights.push(...outboundFlights.map(flight => ({
                ...flight,
                isRoundTrip: false,
                returnFlight: null
              })));
            } else if (returnFlights.length > 0) {
              // If only return flights, still include them but mark as one-way
              console.warn('No outbound flights found for round-trip search');
              formattedFlights.push(...returnFlights.map(flight => ({
                ...flight,
                isRoundTrip: false,
                isReturnLeg: true,
                returnFlight: null
              })));
            }
          }
        }
      } catch (outerErr) {
        console.error('Unexpected error while processing Results:', outerErr);
        // Instead of returning an empty array, throw a more descriptive error
        // that includes the original error message
        const errorMessage = `Error processing flight data: ${outerErr.message || 'Unknown error'}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      console.log(`Formatted ${formattedFlights.length} flights`);
      return formattedFlights;
    } catch (error) {
      console.error('Search flights error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data ? 'Data available (see network tab)' : 'No data'
        } : 'No response',
        request: error.request ? 'Request object exists' : 'No request object'
      });

      // 🔥 If API gives success:false OR ANY ERROR → use demoFlight
      if (USE_DEMO_ON_ERROR) {
        console.warn("⚠️ API error detected — Loading demo flights");
        return demoFlight;   // ← DEMO FLIGHTS RETURN
      }

      // If we have a response from the server
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Server responded with status ${status}:`, data);
        const errorMessage = data?.message ||
          data?.error?.message ||
          `Server error: ${status} ${error.response.statusText || 'Unknown error'}`;
        throw new Error(errorMessage);
      }

      // If it's a network error or other client-side error
      if (error.request) {
        console.error('No response received from server. Network error:', error.message);
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }

      // For any other type of error
      console.error('Unexpected error during flight search:', error);
      throw new Error(error.message || 'An unexpected error occurred while searching for flights');
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
