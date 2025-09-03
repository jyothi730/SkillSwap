import React, { Component } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Profile.css"

// Wrapper to allow class component access to params
function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class Profile extends Component {
  state = {
    name: "",
    email: "",
    score: 0,
    skillsOffered: [],
    skillsRequired: [],
    location: "",
  };

  async componentDidMount() {
    try {
      const token = localStorage.getItem("token");
      const { id } = this.props.params;

      let url = id
        ? `http://localhost:5000/api/users/${id}` // viewing another user
        : "http://localhost:5000/api/users/me/profile"; // viewing own profile

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.setState({
        name: res.data.name,
        email: res.data.email,
        score: res.data.score || 0,
        skillsOffered: res.data.skillsOffered || [],
        skillsRequired: res.data.skillsRequired || [],
        location: res.data.location || "Not provided",
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <div className="profile-container">
        
        <div className="profile-card">
          <h3>{this.state.name}</h3>
          <p>Email: {this.state.email}</p>
          <p>Score: {this.state.score}</p>
          <p>Location: {this.state.location}</p>

          <h4>Skills Offered:</h4>
          {this.state.skillsOffered.length > 0 ? (
            <ul>
              {this.state.skillsOffered.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No offered skills</p>
          )}

          <h4>Skills Required:</h4>
          {this.state.skillsRequired.length > 0 ? (
            <ul>
              {this.state.skillsRequired.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No required skills</p>
          )}

          <button
            className="contact-btn"
            onClick={() => (window.location = `mailto:${this.state.email}`)}
          >
            Contact
          </button>
        </div>
      </div>
    );
  }
}

export default withParams(Profile);
