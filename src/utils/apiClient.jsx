import axios from 'axios';

// 1. Create an Axios instance with your Base URL
const apiClient = axios.create({
  // baseURL: 'http://localhost:5000/api', // Change this once for the whole app!
    baseURL: 'https://programming-backend-resume.onrender.com/api',

  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add an "Interceptor" to automatically insert the token
apiClient.interceptors.request.use(
  (config) => {
    // Read token from localStorage
    const token = localStorage.getItem('auth-token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['auth-token'] = token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;