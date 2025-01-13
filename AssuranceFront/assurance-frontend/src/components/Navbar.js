import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../navbar.css"; // Assuming custom CSS file

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Calls the logout function from context
    navigate("/login");  // Redirects to login page after logout
  };

  return (
    <div className="header">
      {/* Logo Section */}
      <div className="header__logo">
        <Link className="text-light text-decoration-none" to="/">
          <strong>Assurance App</strong>
        </Link>
      </div>

      {/* Navbar Section */}
      <nav className="navbar">
        <ul className="navbar__menu">
          {/* Admin Role */}
          {isAuthenticated && user?.role === "admin" && (
            <>
              <li className="navbar__item">
                <Link className="navbar__link" to="/dashboardAdmin">
                  <span>Admin Dashboard</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/constatsmanagement">
                  <span>Manage Constats</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/expertmanagement">
                  <span>Manage Experts</span>
                </Link>
              </li>
            </>
          )}

          {/* Expert Role */}
          {isAuthenticated && user?.role === "expert" && (
            <>
              <li className="navbar__item">
                <Link className="navbar__link" to="/constats">
                  <span>Constats</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/clientProfile">
                  <span>Profile</span>
                </Link>
              </li>
            </>
          )}

          {/* Client Role */}
          {isAuthenticated && user?.role === "client" && (
            <>
               <li className="navbar__item">
                <Link className="navbar__link" to="/dashboardClient">
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/clientProfile">
                  <span>Client Profile</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/create-constat">
                  <span>Constats</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/my-constats">
                  <span>Historique</span>
                </Link>
              </li>
            </>
          )}

          {/* Common Menu for Authenticated Users */}
          {isAuthenticated && (
            <li className="navbar__item">
              <a href="#" className="navbar__link" onClick={handleLogout}>
                <span>Logout</span>
              </a>
            </li>
          )}

          {/* Menu for Non-Authenticated Users */}
          {!isAuthenticated && (
            <>
              <li className="navbar__item">
                <Link className="navbar__link" to="/login">
                  <span>Login</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link className="navbar__link" to="/signup">
                  <span>Signup</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
