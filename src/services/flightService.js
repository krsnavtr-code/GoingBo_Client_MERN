import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Helper function to format flight data
const formatFlightData = (flight, segment, searchParams = {}) => {
  // Calculate duration if we have both departure and arrival times
  let duration = '';
  let durationInMinutes = 0;

  if (segment?.Origin?.DepTime && segment?.Destination?.ArrTime) {
    const depTime = new Date(segment.Origin.DepTime);
    const arrTime = new Date(segment.Destination.ArrTime);
    durationInMinutes = Math.round((arrTime - depTime) / (1000 * 60));
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    duration = `${hours}h ${minutes}m`;
  }

  return {
    id: flight.ResultIndex || `${flight.Airline?.FlightNumber || 'FLT'}-${Date.now()}`,
    airline: {
      code: flight.Airline?.AirlineCode || '',
      name: flight.Airline?.AirlineName || 'Unknown Airline',
      number: flight.Airline?.FlightNumber || '',
      logo: `https://www.gstatic.com/flights/airline_logos/70px/${flight.Airline?.AirlineCode || 'default'}.png`
    },
    origin: segment?.Origin?.Airport?.AirportCode || searchParams.origin || '',
    destination: segment?.Destination?.Airport?.AirportCode || searchParams.destination || '',
    departureTime: segment?.Origin?.DepTime || new Date().toISOString(),
    arrivalTime: segment?.Destination?.ArrTime || new Date().toISOString(),
    duration,
    durationInMinutes,
    stops: segment?.StopQuantity || 0,
    aircraftType: segment?.Equipment || 'N/A',
    fare: {
      baseFare: flight.Fare?.PublishedFare || 0,
      tax: flight.Fare?.Tax || 0,
      totalFare: (flight.Fare?.PublishedFare || 0) + (flight.Fare?.Tax || 0),
      currency: searchParams.currency || 'INR'
    },
    cabinClass: searchParams.cabinClass || 'Economy',
    bookingClass: segment?.BookingClass || '',
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

class FlightService {
  constructor() {
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
        const token = localStorage.getItem('token');
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
      // Map cabin class to numeric values expected by the backend
      // 1: All, 2: Economy, 3: PremiumEconomy, 4: Business, 5: PremiumBusiness, 6: First
      const cabinClassMap = {
        'Economy': 2,
        'Premium Economy': 3,
        'Business': 4,
        'First': 6
      };

      // Format date to YYYY-MM-DD format
      const formatDate = (dateString) => {
        // Ensure the date is in YYYY-MM-DD format
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Returns YYYY-MM-DD
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
        departureDate: formatDate(searchParams.departureDate),
        directFlight: searchParams.directFlight || false,
        oneStopFlight: searchParams.oneStopFlight || false
      };

      // Add return date for round trips
      if (searchParams.tripType === 'roundtrip' && searchParams.returnDate) {
        formattedParams.returnDate = formatDate(searchParams.returnDate);
      }

      console.log('Sending search request:', formattedParams);
      const response = await this.api.post('/flights/search', formattedParams);

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

// Create a single instance of the service
const flightService = new FlightService();

export default flightService;

// For backward compatibility, export individual functions
export const searchFlights = (params) => flightService.searchFlights(params);
export const getFareRules = (sessionId, resultIndex) => flightService.getFareRules(sessionId, resultIndex);
export const bookFlight = (bookingData) => flightService.bookFlight(bookingData);
export const getBookingDetails = (bookingId) => flightService.getBookingDetails(bookingId);
export const cancelBooking = (bookingId) => flightService.cancelBooking(bookingId);
