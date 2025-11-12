import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const searchFlights = async (searchParams) => {
  try {
    const response = await axios.post(`${API_URL}/flights/search`, searchParams, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error.response?.data?.error || new Error('Failed to search for flights');
  }
};

export const getFareRules = async (sessionId, resultIndex) => {
  try {
    const response = await axios.post(
      `${API_URL}/flights/fare-rules`,
      { sessionId, resultIndex },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching fare rules:', error);
    throw error.response?.data?.error || new Error('Failed to fetch fare rules');
  }
};

export const bookFlight = async (bookingData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/flights/book`,
      bookingData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error booking flight:', error);
    throw error.response?.data?.error || new Error('Failed to book flight');
  }
};
