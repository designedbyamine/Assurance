import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
import '../../login.css'; // Import the custom CSS file
import authService from "../../services/authService"; // Import authService for login and role-based navigation

axios.defaults.baseURL = "http://127.0.0.1:5000/api";

const Login = () => {
  const { login } = useContext(AuthContext);  // From AuthContext to store the token
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email, password };
    
    // Call authService login function
    const { success, user, message } = await authService.login(data, login, (token) => {});  // Handle token storage and context update

    if (success) {
      // Role-based redirect
      switch (user.role) {
        case "admin":
          navigate("/dashboardAdmin");
          break;
        case "client":
          navigate("/dashboardClient");
          break;
        case "expert":
          navigate("/constats");
          break;
        
      }
    } else {
      setError(message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back!</h1>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
