import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // Assuming you have authService

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user info (including role)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false); 

  useEffect(() => {
    // Check if the user is authenticated and decode the token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      const currentUser = authService.getCurrentUser(); // Decodes and returns the current user info
      if (currentUser) {
        setUser(currentUser); // Store decoded user info
        setIsAuthenticated(true); // Mark the user as authenticated
      }
    }
  }, []); // Empty array ensures this only runs on mount

  
  const login = async (data) => {
    const response = await authService.login(data, setUser, setIsAuthenticated);
    if (response.success) {
      // Set flag to trigger one-time refresh after login
      setShouldRefresh(true);
    }
    return response;
  };

  // Trigger page refresh once after successful login
  useEffect(() => {
    if (shouldRefresh) {
      window.location.reload(); // This refreshes the page once
      setShouldRefresh(false); // Reset the flag to avoid multiple refreshes
    }
  }, [shouldRefresh]);

  const logout = () => {
    authService.logout(setUser, setIsAuthenticated); // Clears the token and user data
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
