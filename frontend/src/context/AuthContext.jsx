import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "sonner";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("matestay_token");

 
      if (!token) {
        console.log(" No token found in localStorage");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log(" AuthContext: Verifying user with database...");
        
       
        const { data } = await axios.get("/user/profile");
        
        if (data) {
          console.log(" AuthContext: User verified in database:", data.email);
          // Only NOW do we set the user and update localStorage
          localStorage.setItem("matestay_user", JSON.stringify(data));
          setUser(data);
        } else {
          console.log(" AuthContext: No user data returned");
          logout();
        }
      } catch (error) {
        console.error(" AuthContext: Failed to verify user:", error);
        console.error(" Error status:", error.response?.status);
        console.error(" Error message:", error.response?.data?.message);
        
       
        logout();
        
        // Show toast only if it's a deleted user error
        if (error.response?.status === 404 || error.response?.data?.userDeleted) {
          toast.error("Your account has been deleted or is no longer valid.");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Only run once on mount

  const login = (userData, token) => {
    console.log(" User logged in:", userData.email);
    localStorage.setItem("matestay_user", JSON.stringify(userData));
    localStorage.setItem("matestay_token", token);
    setUser(userData);
  };

  const logout = () => {
    console.log(" User logged out");
    localStorage.removeItem("matestay_user");
    localStorage.removeItem("matestay_token");
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      console.log(" AuthContext: Refreshing user data from server...");
      const { data } = await axios.get("/user/profile");
      
      if (data) {
        console.log("AuthContext: User data refreshed successfully");
        localStorage.setItem("matestay_user", JSON.stringify(data));
        setUser(data);
        return data;
      }
      
      logout();
      return null;
    } catch (err) {
      console.error(" AuthContext: Failed to refresh user:", err);
      console.error(" Error status:", err.response?.status);
      console.error(" Error data:", err.response?.data);
      
      // If user doesn't exist or token is invalid
      if (err.response?.status === 404 || 
          err.response?.status === 401 || 
          err.response?.data?.userDeleted) {
        console.log(" AuthContext: User no longer exists in database");
        logout();
      }
      
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};