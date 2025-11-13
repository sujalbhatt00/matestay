import axios from "axios";
import { toast } from "sonner";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("matestay_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we're already redirecting to prevent multiple redirects
let isRedirecting = false;

// Handle errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    console.log("🔴 Axios Error:", {
      status,
      message: data?.message,
      userDeleted: data?.userDeleted
    });

    // If user is deleted from database or token is invalid
    if (status === 401 || status === 404) {
      // Check if it's specifically a "user deleted" error
      if (data?.userDeleted || data?.message?.includes("User not found") || data?.message?.includes("Account may have been deleted")) {
        if (!isRedirecting) {
          isRedirecting = true;
          console.log("🚨 axiosInstance: User account deleted or not found - logging out");
          
          // Clear localStorage
          localStorage.removeItem("matestay_token");
          localStorage.removeItem("matestay_user");
          
          // Show toast
          toast.error("Your account has been deleted or is no longer valid.", {
            duration: 3000,
          });
          
          // Redirect to home after a short delay
          setTimeout(() => {
            isRedirecting = false;
            window.location.href = "/";
          }, 1500);
        }
        
        return Promise.reject(error);
      }
      
      // For other 401 errors (expired token, etc.)
      if (status === 401 && data?.message?.includes("Not authorized")) {
        if (!isRedirecting) {
          isRedirecting = true;
          console.log("🚨 axiosInstance: Unauthorized - logging out");
          localStorage.removeItem("matestay_token");
          localStorage.removeItem("matestay_user");
          toast.error("Session expired. Please log in again.");
          setTimeout(() => {
            isRedirecting = false;
            window.location.href = "/";
          }, 1000);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;