import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
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
      await axios.post("http://localhost:5000/api/users/register", {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        skillsRequired: this.state.skillsRequired.split(",").map(s => s.trim()),
        skillsOffered: this.state.skillsOffered.split(",").map(s => s.trim()),
        location: this.state.location,
      });
      window.location.href = "/login";
    } catch (err) {
      this.setState({ error: err.response?.data?.message || "Registration failed" });
    }
  };

  render() {
    return (
      <div className="page-container">
        <div className="register-card">
          <h2>Register</h2>
          {this.state.error && <p style={{ color: "red" }}>{this.state.error}</p>}
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
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
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
