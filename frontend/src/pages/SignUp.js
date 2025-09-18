import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './SignUp.css'

class SignUp extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    skillsRequired: "",
    skillsOffered: "",
    location: "",
    error: ""
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        skillsRequired: this.state.skillsRequired.split(",").map(s => s.trim()),
        skillsOffered: this.state.skillsOffered.split(",").map(s => s.trim()),
        location: this.state.location,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userId", res.data._id);
      window.location.href = "/dashboard";
    } catch (err) {
      this.setState({ error: err.response?.data?.message || "Signup failed" });
    }
  };

  render() {
    return (
      <div className="auth-container">
        <div className="auth-card">
          {this.state.error && <p style={{ color: "red" }}>{this.state.error}</p>}
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={this.state.name}
              onChange={this.handleChange}
            /><br/>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleChange}
            /><br/>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleChange}
            /><br/>
            <input
              type="text"
              name="skillsRequired"
              placeholder="Skills Required (comma separated)"
              value={this.state.skillsRequired}
              onChange={this.handleChange}
            /><br/>
            <input
              type="text"
              name="skillsOffered"
              placeholder="Skills Offered (comma separated)"
              value={this.state.skillsOffered}
              onChange={this.handleChange}
            /><br/>
            <input
              type="text"
              placeholder="Enter your location"
              value={this.state.location}
              onChange={(e) => this.setState({ location: e.target.value })}
            /><br/>
            <button type="submit" className="btn">
              Sign Up
            </button>
          </form>
          <p className="switch"> 
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default SignUp
