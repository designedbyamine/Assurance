import { jwtDecode } from "jwt-decode";
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:5000/api";

const authService = {
  // Login method: Saves token, decodes it, and updates user state
  login: async (data, setUser, setIsAuthenticated) => {
    try {
      const response = await axios.post("/auth/login/", data);

      if (response.data.token) {
        // Save the token to localStorage
        localStorage.setItem("authToken", response.data.token);

        // Decode the token to get user details
        const decodedToken = jwtDecode(response.data.token);
        console.log(decodedToken);

        // Set the user data in context
        setUser(decodedToken);
        setIsAuthenticated(true); // Update authentication status

        return { success: true, user: decodedToken };
      }

      return { success: false, message: response.data.message || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  },

  // Register method: Handles user registration
  register: async (data) => {
    try {
      const response = await axios.post("/auth/register", data);
      console.log("Backend Response:", response.data); // Log the full response for debugging

      if (response.data._id && response.data.token) {
        // Return success status to the caller if user and token are returned
        return { success: true, message: "Registration successful", data: response.data };
      }

      // If the response does not contain user ID or token, show a generic error
      return { success: false, message: response.data.message || "Registration failed" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "An error occurred during registration" };
    }
  },

  // Logout method: Clears the user and token data
  logout: (setUser, setIsAuthenticated) => {
    localStorage.removeItem("authToken"); // Clear the token
    setUser(null); // Clear user data
    setIsAuthenticated(false); // Mark user as unauthenticated
    window.location.href = "/login"; // Redirect to login page (or use navigate for SPA)
  },

  // Retrieve the current user from the decoded token
  getCurrentUser: () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found");
      return null;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.id && decodedToken.role) {
        return decodedToken; // Return user data if valid token
      } else {
        return null; // Return null if token payload is invalid
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return null; // Return null if token is invalid or error occurs
    }
  },

  // Method to check if user is authenticated based on token presence
  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    return token ? true : false; // Return true if token exists, else false
  },
};

export default authService;
