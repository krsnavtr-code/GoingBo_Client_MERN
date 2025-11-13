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

// Flight Services
export const flightService = {
  // Search for flights
  searchFlights: async (searchParams) => {
    try {
      // Transform data to match backend format
      const formattedParams = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departureDate,
        return_date: searchParams.returnDate,
        adults: searchParams.adults || 1,
        children: searchParams.children || 0,
        infants: searchParams.infants || 0,
        cabin_class: searchParams.cabinClass || 'Economy',
        non_stop: searchParams.nonStop || false
      };

      console.log('Sending search request:', formattedParams);
      const response = await api.post(`${API_BASE_URL}/flights/search`, formattedParams);
      return response.data;
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
