import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';  // Make sure the AuthContext is created in your context folder
import Navbar from "./components/Navbar"; // Make sure Navbar component exists in the components folder
import Footer from "./components/Footer"; // Make sure Footer component exists in the components folder
import AppRoutes from "./routes.js"; // Import your routes (make sure routes.js file is present)

const App = () => {
  return (
    
    <AuthProvider>
      <Router>
      <div className="app-container">
          <Navbar />  {/* Navbar component */}
          <AppRoutes />  {/* Routes component to manage route definitions */}
          </div> <Footer />
          {/* Footer component */}
      </Router>
    </AuthProvider>
  );
};

export default App;