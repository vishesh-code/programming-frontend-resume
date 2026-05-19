import axios from "axios";

// 1. Create instance
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: 'https://programming-backend-resume.onrender.com/api',
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor (Existing - attaches token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers["auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (NEW - Handles Token Expiration)
apiClient.interceptors.response.use(
  (response) => {
    // If the response is good, just return it
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or invalid. Logging out...");

      // 1. Clear Local Storage
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user-email");
      localStorage.removeItem("user-id");

      // 2. Force Redirect to Login Page
      // We use window.location because apiClient is not a React component,
      // so we can't use the useNavigate hook here easily.
      window.location.href = "/";
    }

    // Return the error so specific components can still handle other errors (like 404 or 500)
    return Promise.reject(error);
  }
);

export default apiClient;
