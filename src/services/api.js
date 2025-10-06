// Use NEXT_PUBLIC_ prefix to expose the variable to the browser
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get cookie by name
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Helper function to handle API requests
async function fetchAPI(endpoint, method = 'GET', data = null) {
  // Ensure endpoint starts with a forward slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}/api/v1${normalizedEndpoint}`;
  
  // Get the JWT token from cookies
  const token = getCookie('jwt');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies/sessions
  };
  
  // Add Authorization header if token exists
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }
    
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'Something went wrong');
      error.status = response.status;
      // Only log non-401 errors to the console
      if (response.status !== 401) {
        console.error('API Error:', error);
      }
      throw error;
    }

    return responseData;
  } catch (error) {
    // Only log non-401 errors
    if (error.status !== 401) {
      console.error('API Error:', error);
    }
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return fetchAPI('/users/login', 'POST', { email, password });
  },
  
  signup: async (name, email, password, passwordConfirm) => {
    return fetchAPI('/users/signup', 'POST', { 
      name, 
      email, 
      password, 
      passwordConfirm 
    });
  },
  
  forgotPassword: async (email) => {
    return fetchAPI('/users/forgot-password', 'POST', { email });
  },
  
  verifyOTP: async (email, otp) => {
    return fetchAPI('/users/verify-otp', 'POST', { email, otp });
  },
  
  resetPassword: async (token, password, passwordConfirm) => {
    return fetchAPI(`/users/reset-password/${token}`, 'PATCH', { 
      password, 
      passwordConfirm 
    });
  },
  
  logout: async () => {
    return fetchAPI('/users/logout', 'GET');
  },
  
  getCurrentUser: async () => {
    return fetchAPI('/users/me', 'GET');
  }
};

export default {
  auth: authAPI
};
