import React, { Component } from "react";
import API from "../api";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaUserEdit,
  FaAward,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import "./Profile.css";

class Profile extends Component {
  state = {
    name: "",
    email: "",
    location: "",
    skillsOffered: [],
    skillsRequired: [],
    credits: 0,
    memberSince: "",
    recentActivity: [], 
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const { id } = this.props.params; 
      let url = id ? `/users/${id}` : "/users/me"; 
      
      const res = await API.get(url); 

      this.setState({
        name: res.data.name,
        email: res.data.email,
        location: res.data.location || "Not provided",
        skillsOffered: res.data.skillsOffered || [],
        skillsRequired: res.data.skillsRequired || [],
        credits: res.data.credits || 0,
        memberSince: res.data.createdAt || "",
        loading: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false, error: "Failed to load profile" });
    }
  }

  getInitials(name) {
    if (!name) return "";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0];
    return names[0][0] + names[1][0];
  }

  render() {
    const {
      name,
      email,
      location,
      skillsOffered,
      skillsRequired,
      credits,
      memberSince,
      recentActivity,
      loading,
      error,
    } = this.state;

    if (loading) return <div className="loader">Loading profile...</div>
    if (error) return <div className="error">{error}</div>

    const memberSinceFormatted = memberSince
      ? new Date(memberSince).toLocaleString("default", { month: "short", year: "numeric" })
      : "N/A";

    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar-circle">{this.getInitials(name)}</div>
          <div className="profile-info">
            <h2>{name}</h2>
            <p><FaMapMarkerAlt /> {location}</p>
            <p><FaEnvelope /> {email}</p>
          </div>
          <button className="edit-profile-btn">
            <FaUserEdit /> Edit Profile
          </button>
        </div>

        <div className="stats-cards">
          <div className="card">
            <div className="stat-number">{skillsOffered.length}</div>
            <div>Skills Taught <FaAward /></div>
          </div>
          <div className="card">
            <div className="stat-number">{skillsRequired.length}</div>
            <div>Skills Learned <FaUsers /></div>
          </div>
          <div className="card">
            <div className="stat-number">{memberSinceFormatted}</div>
            <div>Member Since <FaCalendarAlt /></div>
          </div>
          <div className="card">
            <div className="stat-number">{credits}</div>
            <div>Credits <FaAward /></div>
          </div>
        </div>

        <div className="skills-sections">
          <div className="skills-block">
            <h3>Skills I Can Teach</h3>
            <p>Share your expertise with others and earn credits</p>
            <div className="skills-tags">
              {skillsOffered.length > 0 ? skillsOffered.map((skill, idx) => (
                <span key={idx} className="skill-tag teach">{skill}</span>
              )) : <p>No skills listed</p>}
            </div>
          </div>

          <div className="skills-block">
            <h3>Skills I Want to Learn</h3>
            <p>Areas where you're looking to grow and improve</p>
            <div className="skills-tags">
              {skillsRequired.length > 0 ? skillsRequired.map((skill, idx) => (
                <span key={idx} className="skill-tag learn">{skill}</span>
              )) : <p>No skills listed</p>}
            </div>
          </div>
        </div>

        {/* You can omit recent activity if backend does not provide */}
        {recentActivity.length > 0 && (
          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <p>Your skill exchange history and achievements</p>
            {recentActivity.map((item, idx) => (
              <div key={idx} className={`activity-item ${item.status.toLowerCase()}`}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span className="activity-badge">{item.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Profile;
