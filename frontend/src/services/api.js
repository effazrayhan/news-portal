import axios from 'axios';

const API_URL = 'http://localhost:3699/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

/**
 * Authentication API
 */
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (userData) => apiClient.put('/auth/profile', userData)
};

/**
 * Articles API
 */
export const articleAPI = {
  // Get articles with filters
  getAll: (params = {}) => apiClient.get('/articles', { params }),
  
  // Get article by ID
  getById: (id) => apiClient.get(`/articles/${id}`),
  
  // Create new article (Editor/Admin)
  create: (articleData) => apiClient.post('/articles', articleData),
  
  // Update article
  update: (id, articleData) => apiClient.put(`/articles/${id}`, articleData),
  
  // Delete article
  delete: (id) => apiClient.delete(`/articles/${id}`),
  
  // Get articles by author
  getByAuthor: (authorId, params = {}) => 
    apiClient.get(`/articles/author/${authorId}`, { params })
};

/**
 * Categories API
 */
export const categoryAPI = {
  // Get all categories
  getAll: (params = {}) => apiClient.get('/categories', { params }),
  
  // Get category by ID
  getById: (id) => apiClient.get(`/categories/${id}`),
  
  // Create category (Admin only)
  create: (categoryData) => apiClient.post('/categories', categoryData),
  
  // Update category (Admin only)
  update: (id, categoryData) => apiClient.put(`/categories/${id}`, categoryData),
  
  // Delete category (Admin only)
  delete: (id) => apiClient.delete(`/categories/${id}`)
};

/**
 * Comments API
 */
export const commentAPI = {
  // Get comments for article
  getByArticle: (articleId, params = {}) => 
    apiClient.get(`/comments/article/${articleId}`, { params }),
  
  // Create comment
  create: (articleId, commentData) => 
    apiClient.post(`/comments/article/${articleId}`, commentData),
  
  // Update comment
  update: (commentId, commentData) => 
    apiClient.put(`/comments/${commentId}`, commentData),
  
  // Delete comment
  delete: (commentId) => apiClient.delete(`/comments/${commentId}`),
  
  // Approve comment (Admin only)
  approve: (commentId) => apiClient.post(`/comments/${commentId}/approve`),
  
  // Get pending comments (Admin only)
  getPending: (params = {}) => 
    apiClient.get('/comments/pending/all', { params })
};

// Export axios instance for additional use
export default apiClient;
