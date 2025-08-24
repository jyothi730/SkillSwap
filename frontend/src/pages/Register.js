import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    skills: "",
    error: ""
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        skills: this.state.skills.split(","),
      });
      window.location.href = "/login";
    } catch (err) {
      this.setState({ error: "Registration failed" });
    }
  };

  render() {
    return (
      <div>
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
            name="skills"
            placeholder="Skills (comma separated)"
            value={this.state.skills}
            onChange={this.handleChange}
          /><br/>
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default Register;
