import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/hotels`;

// Helper function to handle API errors
const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  const errorMessage = error.response?.data?.message || 
                      error.message || 
                      defaultMessage;
  throw new Error(errorMessage);
};

/**
 * Search hotels with the given parameters
 * @param {Object} params - Search parameters
 * @param {string} params.city - City name or ID
 * @param {string} params.checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} params.checkOut - Check-out date (YYYY-MM-DD)
 * @param {Object} params.guests - Guest information
 * @param {number} params.rooms - Number of rooms
 * @returns {Promise<Object>} Search results
 */
export const searchHotels = async (params) => {
    try {
        // Prepare the request payload
        const payload = {
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            city: params.city,
            country: params.country,
            guests: {
                adults: parseInt(params.guests?.adults) || 2,
                children: parseInt(params.guests?.children) || 0,
                childrenAges: Array.isArray(params.guests?.childrenAges) 
                    ? params.guests.childrenAges.map(age => parseInt(age) || 0)
                    : []
            },
            rooms: parseInt(params.rooms) || 1
        };

        console.log('Sending hotel search request with payload:', payload);
        
        const response = await axios.post(`${API_BASE_URL}/search`, payload);
        return response.data;
    } catch (error) {
        console.error('Hotel search error:', error);
        return handleApiError(error, 'Failed to search for hotels');
    }
};

/**
 * Get detailed information about a specific hotel
 * @param {string} hotelCode - Hotel code
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @returns {Promise<Object>} Hotel details
 */
export const getHotelDetails = async (hotelCode, checkIn, checkOut) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/details`, {
            HotelCode: hotelCode,
            CheckIn: checkIn,
            CheckOut: checkOut,
            GuestNationality: 'IN',
            TokenId: process.env.NEXT_PUBLIC_TBO_AUTH_TOKEN || ''
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to get hotel details');
    }
};

// Pre-book hotel
export const preBookHotel = async (bookingDetails) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/prebook`, { bookingDetails });
        return response.data;
    } catch (error) {
        console.error('Error pre-booking hotel:', error);
        throw error;
    }
};

// Confirm booking
export const bookHotel = async (bookingDetails) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/book`, { bookingDetails });
        return response.data;
    } catch (error) {
        console.error('Error booking hotel:', error);
        throw error;
    }
};

// Get booking details
export const getHotelBookingDetails = async (bookingId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/booking/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting booking details:', error);
        throw error;
    }
};

/**
 * Fetch hotels by city code
 * @param {string} cityCode - City code to search hotels in
 * @param {boolean} [detailed=false] - Whether to include detailed response
 * @returns {Promise<Object>} List of hotels
 */
export const fetchHotelsByCity = async (cityCode, detailed = false) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/fetch-hotels`, {
            CityCode: cityCode,
            IsDetailedResponse: detailed,
            TokenId: process.env.NEXT_PUBLIC_TBO_AUTH_TOKEN || ''
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch hotels');
    }
};

/**
 * Get list of available countries
 * @returns {Promise<Array>} List of countries
 */
export const getCountries = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/countries`);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch countries');
    }
};

/**
 * Get list of cities in a country
 * @param {string} countryCode - Country code (e.g., 'IN' for India)
 * @returns {Promise<Array>} List of cities
 */
export const getCitiesByCountry = async (countryCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cities`, {
            params: { countryCode }
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to fetch cities');
    }
};

/**
 * Search for cities by name or code
 * @param {string} query - Search query (city name or code)
 * @returns {Promise<Array>} List of matching cities
 */
export const searchCities = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search-cities`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching cities:', error);
        return [];
    }
};

/**
 * Search for hotels by query string
 * @param {string} query - Search query (city or hotel name)
 * @returns {Promise<Array>} List of matching hotels
 */
export const searchHotelsByQuery = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search-hotels`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Failed to search hotels');
    }
};

// Register a new hotel
export const registerHotel = async (hotelData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, hotelData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error registering hotel:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(error.response.data.message || 'Failed to register hotel');
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from server. Please check your connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(error.message || 'Error setting up registration');
        }
    }
};