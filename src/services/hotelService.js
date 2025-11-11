import axios from 'axios';

const API_BASE_URL = '/api/v1/hotels';

// Search hotels
export const searchHotels = async (searchParams) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/search`, searchParams);
        return response.data;
    } catch (error) {
        console.error('Error searching hotels:', error);
        throw error;
    }
};

// Get hotel details
export const getHotelDetails = async (hotelCode, checkIn, checkOut) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/details`, {
            hotelCode,
            checkIn,
            checkOut
        });
        return response.data;
    } catch (error) {
        console.error('Error getting hotel details:', error);
        throw error;
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

// Search hotel codes
export const searchHotelCodes = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/hotel-codes`, {
            params: { searchQuery: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching hotel codes:', error);
        throw error;
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