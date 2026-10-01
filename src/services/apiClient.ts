import axios from "axios";
import { handleLogout } from "../Components/Utility/Auth";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessTokens");
    if (token && config.headers) {
      // Clean up the token if it's stored with quotes
      const cleanToken = token.replace(/^"(.*)"$/, "$1");
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401s
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401 || status === 403) {
        console.warn("Unauthorized request detected by Axios, logging out...");
        handleLogout();
      }
      
      // Handle the specific backend error message "Authentication Failure!" which might come as 500
      if (status === 500 && data?.err === "Authentication Failure!") {
        console.warn("Authentication failure detected in Axios 500 response, logging out...");
        handleLogout();
      }
    }
    return Promise.reject(error);
  }
);

// Attach Axios static properties for compatibility with existing code
(apiClient as any).CancelToken = axios.CancelToken;
(apiClient as any).isCancel = axios.isCancel;

export default apiClient;
