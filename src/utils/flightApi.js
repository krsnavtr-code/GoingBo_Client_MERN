import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const searchFlights = async (searchParams) => {
  try {
    console.log('Sending request to:', `${API_URL}/flights/search`);
    console.log('Request data:', JSON.stringify(searchParams, null, 2));
    
    const response = await axios.post(`${API_URL}/flights/search`, searchParams, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    console.log('API response:', response.data);
    
    // Handle different response formats
    if (!response.data) {
      throw new Error('Empty response from server');
    }
    
    // If the response has an error property, throw it
    if (response.data.error) {
      throw new Error(response.data.error.message || 'API returned an error');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in searchFlights:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
    
    // Handle different types of errors
    let errorMessage = 'Failed to search for flights';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      if (status === 400) {
        errorMessage = data.error?.message || 'Invalid request parameters';
      } else if (status === 401) {
        errorMessage = 'Authentication failed. Please try again.';
      } else if (status === 404) {
        errorMessage = 'No flights found for the selected criteria';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (data?.error?.message) {
        errorMessage = data.error.message;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    }
    
    throw new Error(errorMessage);
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
