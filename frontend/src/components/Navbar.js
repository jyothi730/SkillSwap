import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    const isLoggedIn = localStorage.getItem("token");

    return (
      <nav>
        <Link to="/dashboard" style={{ marginRight: "10px" }}>
          Dashboard
        </Link>
        <Link to="/match" style={{ marginRight: "10px" }}>
          Skill Match
        </Link>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={{ marginRight: "10px" }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        )}
      </nav>
    );
  }
}

export default Navbar;
