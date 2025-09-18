import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isLoggedIn = localStorage.getItem("token");
  const username = localStorage.getItem("name") || "User";

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <Link to="/dashboard" className="logo">
          Skill<span>Swap</span>
        </Link>
      </div>

      {/* Center Links */}
      <div className="navbar-center">
        <Link
          to="/dashboard"
          className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <FaHome className="nav-icon" />
          Dashboard
        </Link>
        <Link
          to="/match"
          className={`nav-link ${location.pathname === "/match" ? "active" : ""}`}
        >
          <FaUsers className="nav-icon" />
          Skill Match
        </Link>
        <Link
          to="/profile"
          className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
        >
          <FaUser className="nav-icon" />
          My Profile
        </Link>
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="signup-btn">
              Signup
            </Link>
          </>
        ) : (
          <>
            <div className="user-info">
              <div className="avatar">{username.charAt(0)}</div>
              <span className="username">{username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut className="logout-icon" />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
