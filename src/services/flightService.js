import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response received from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Helper function to format flight data
const formatFlightData = (flight, segment, searchParams) => {
  const departureTime = new Date(segment.Origin.DepTime);
  const arrivalTime = new Date(segment.Destination.ArrTime);
  const durationInMinutes = Math.round((arrivalTime - departureTime) / (1000 * 60));
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const duration = `${hours}h ${minutes}m`;

  return {
    id: flight.ResultIndex,
    resultIndex: flight.ResultIndex,
    sessionId: flight.ResultSession,
    airline: segment.Airline?.AirlineName || flight.Airline?.AirlineName || 'Unknown Airline',
    airlineCode: segment.Airline?.AirlineCode || flight.Airline?.AirlineCode || 'UA',
    flightNumber: segment.Airline?.FlightNumber
      ? `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`
      : flight.Airline?.FlightNumber
        ? `${flight.Airline.AirlineCode} ${flight.Airline.FlightNumber}`
        : 'N/A',
    origin: segment.Origin?.Airport?.AirportCode || searchParams.origin,
    destination: segment.Destination?.Airport?.AirportCode || searchParams.destination,
    departureTime: departureTime.toISOString(),
    arrivalTime: arrivalTime.toISOString(),
    duration,
    durationInMinutes,
    stops: segment.StopQuantity || 0,
    aircraftType: segment.Equipment || 'N/A',
    fare: {
      baseFare: flight.Fare?.PublishedFare || 0,
      tax: flight.Fare?.Tax || 0,
      totalFare: (flight.Fare?.PublishedFare || 0) + (flight.Fare?.Tax || 0),
      currency: searchParams.currency || 'INR'
    },
    cabinClass: searchParams.cabinClass || 'Economy',
    bookingClass: segment.BookingClass,
    fareType: flight.Fare?.FareType || 'PUBLISHED',
    baggage: flight.Fare?.ChargeableBaggage || 'Check Fare Rules',
    refundable: flight.Fare?.Refundable || false,
    amenities: {
      wifi: flight.Fare?.IsWifiAvailable || false,
      meals: flight.Fare?.IsMealAvailable || false,
      entertainment: flight.Fare?.IsEntertainmentAvailable || false
    },
    segments: [segment],
    ...searchParams
  };
};

// Flight Services
export const flightService = {
  // Search for flights
  searchFlights: async (searchParams) => {
    try {
      // Map cabin class to numeric values expected by the backend
      // 1: All, 2: Economy, 3: PremiumEconomy, 4: Business, 5: PremiumBusiness, 6: First
      const cabinClassMap = {
        'Economy': 2,
        'Premium Economy': 3,
        'Business': 4,
        'First': 6
      };

      // Format date to include time
      const formatDate = (dateString) => {
        return `${dateString}T00:00:00`;
      };

      // Transform data to match backend format
      const formattedParams = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        journey_type: searchParams.tripType === 'roundtrip' ? 2 : 1, // 1: OneWay, 2: Return
        adult: parseInt(searchParams.adults) || 1,
        child: parseInt(searchParams.children) || 0,
        infant: parseInt(searchParams.infants) || 0,
        travelclass: cabinClassMap[searchParams.cabinClass] || 2, // Default to Economy (2) if not found
        departure_date: formatDate(searchParams.departureDate),
        directFlight: searchParams.directFlight || false,
        oneStopFlight: searchParams.oneStopFlight || false
      };

      // Add return date for round trips
      if (searchParams.tripType === 'roundtrip' && searchParams.returnDate) {
        formattedParams.return_date = formatDate(searchParams.returnDate);
      }

      console.log('Sending search request:', formattedParams);
      const response = await api.post('/flights/search', formattedParams);

      if (!response.data || !response.data.Response) {
        throw new Error('Invalid response format from server');
      }

      const { Results, IsError, Error } = response.data.Response;

      if (IsError) {
        throw new Error(Error?.ErrorMessage || 'Error fetching flights');
      }

      if (!Results || !Array.isArray(Results) || Results.length === 0) {
        return [];
      }

      // Process and format the flight results
      const formattedFlights = [];

      Results.forEach((result) => {
        if (!result || !Array.isArray(result)) return;

        result.forEach((flight) => {
          if (!flight.Segments || !Array.isArray(flight.Segments)) return;

          // Create a flight object for each segment
          flight.Segments.forEach((segment) => {
            if (!segment.Origin || !segment.Destination) return;

            const formattedFlight = formatFlightData(flight, segment, searchParams);
            formattedFlights.push(formattedFlight);
          });
        });
      });

      return formattedFlights;
    } catch (error) {
      console.error('Search flights error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  },

  // Get fare rules for a specific flight
  getFareRules: async (sessionId, resultIndex) => {
    try {
      const response = await api.post(`${API_BASE_URL}/flights/fare-rules`, { sessionId, resultIndex });
      return response.data;
    } catch (error) {
      console.error('Get fare rules error:', error);
      throw error;
    }
  },

  // Book a flight
  bookFlight: async (bookingData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/flights/book`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Book flight error:', error);
      throw error;
    }
  },

  // Get booking details
  getBookingDetails: async (bookingId) => {
    try {
      const response = await api.get(`${API_BASE_URL}/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Get booking details error:', error);
      throw error;
    }
  },

  // Cancel a booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  },
};

// Export individual functions for easier imports
export const searchFlights = flightService.searchFlights;
export const getFareRules = flightService.getFareRules;
export const bookFlight = flightService.bookFlight;
export const getBookingDetails = flightService.getBookingDetails;
export const cancelBooking = flightService.cancelBooking;

export default flightService;
