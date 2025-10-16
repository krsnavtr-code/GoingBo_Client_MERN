// Use NEXT_PUBLIC_ prefix to expose the variable to the browser
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to handle API requests
async function fetchBlogAPI(endpoint, method = 'GET', data = null, isPublic = true) {
  // Ensure endpoint starts with a forward slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}/api/v1${normalizedEndpoint}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies/sessions
  };

  // Add Authorization header if not public endpoint
  if (!isPublic) {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt='))
      ?.split('=')[1];

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
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
      throw error;
    }

    return responseData;
  } catch (error) {
    console.error('Blog API Error:', error);
    throw error;
  }
}

// Blog API service
export const blogAPI = {
  // Get all blog posts
  getBlogPosts: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      tag,
      search,
      category,
      sort = '-publishedAt'
    } = params;

    let url = `/blog?published=true&page=${page}&limit=${limit}&sort=${sort}`;

    if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;

    return fetchBlogAPI(url, 'GET', null, true);
  },

  // Get a single blog post by slug
  getBlogBySlug: async (slug) => {
    return fetchBlogAPI(`/blog/slug/${slug}`, 'GET', null, true);
  },

  // Create a new blog post (requires authentication)
  createBlogPost: async (postData) => {
    return fetchBlogAPI('/blog', 'POST', postData, false);
  },

  // Update a blog post (requires authentication)
  updateBlogPost: async (id, postData) => {
    return fetchBlogAPI(`/blog/${id}`, 'PUT', postData, false);
  },

  // Delete a blog post (requires authentication)
  deleteBlogPost: async (id) => {
    return fetchBlogAPI(`/blog/${id}`, 'DELETE', null, false);
  },

  // Get related blog posts
  getRelatedPosts: async (tags, excludeId, limit = 3) => {
    return fetchBlogAPI(
      `/blog/related?tags=${tags.join(',')}&excludeId=${excludeId}&limit=${limit}`,
      'GET',
      null,
      true
    );
  },

  // Search blog posts
  searchBlogs: async (query) => {
    return fetchBlogAPI(`/blog/search?q=${encodeURIComponent(query)}`, 'GET', null, true);
  },
};

export default blogAPI;
