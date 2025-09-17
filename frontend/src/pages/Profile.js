import React, { Component } from "react";
import { useParams } from "react-router-dom";
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
    isEditing: false,
    editForm: {
      name: "",
      location: "",
      skillsOffered: "",
      skillsRequired: ""
    }
  };

  async componentDidMount() {
    try {
      const { id } = this.props.params || {}; 
      let url = id ? `/users/${id}` : "/users/me"; 
      
      const res = await API.get(url); 

      this.setState({
        name: res.data.name,
        email: res.data.email,
        location: res.data.location || "Not provided",
        skillsOffered: res.data.skillsOffered || [],
        skillsRequired: res.data.skillsRequired || [],
        credits: res.data.credits || 0,
        taughtCount: res.data.taughtCount || 0,
        learnedCount: res.data.learnedCount || 0,
        memberSince: res.data.createdAt || "",
        loading: false,
        isOwnProfile: !id, 
        userId: res.data._id
      });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false, error: "Failed to load profile" });
    }
  }

  handleEditClick = () => {
    this.setState({
      isEditing: true,
      editForm: {
        name: this.state.name,
        location: this.state.location === "Not provided" ? "" : this.state.location,
        skillsOffered: this.state.skillsOffered.join(", "),
        skillsRequired: this.state.skillsRequired.join(", ")
      }
    });
  }

  handleEditChange = (e) => {
    this.setState({
      editForm: {
        ...this.state.editForm,
        [e.target.name]: e.target.value
      }
    });
  }

  handleSaveEdit = async () => {
    try {
      const { editForm } = this.state;
      const updateData = {
        name: editForm.name,
        location: editForm.location,
        skillsOffered: editForm.skillsOffered.split(",").map(s => s.trim()).filter(s => s),
        skillsRequired: editForm.skillsRequired.split(",").map(s => s.trim()).filter(s => s)
      };

      await API.put(`/users/${this.state.userId}`, updateData);

      this.setState({
        name: updateData.name,
        location: updateData.location || "Not provided",
        skillsOffered: updateData.skillsOffered,
        skillsRequired: updateData.skillsRequired,
        isEditing: false
      });

      if (this.state.isOwnProfile) {
        localStorage.setItem("name", updateData.name);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    }
  }

  handleCancelEdit = () => {
    this.setState({ isEditing: false });
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
      isEditing,
      editForm,
      isOwnProfile
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
          {isOwnProfile && (
            <button className="edit-profile-btn" onClick={this.handleEditClick}>
              <FaUserEdit /> Edit Profile
            </button>
          )}
        </div>

        <div className="stats-cards">
          <div className="card">
            <div className="stat-number">{this.state.taughtCount || 0}</div>
            <div>Skills Taught <FaAward /></div>
          </div>
          <div className="card">
            <div className="stat-number">{this.state.learnedCount || 0}</div>
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

        {isEditing ? (
          <div className="edit-form">
            <h3>Edit Profile</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={this.handleEditChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={this.handleEditChange}
                className="form-input"
                placeholder="Enter your location"
              />
            </div>
            <div className="form-group">
              <label>Skills I Can Teach (comma separated):</label>
              <input
                type="text"
                name="skillsOffered"
                value={editForm.skillsOffered}
                onChange={this.handleEditChange}
                className="form-input"
                placeholder="e.g., React, Node.js, Python"
              />
            </div>
            <div className="form-group">
              <label>Skills I Want to Learn (comma separated):</label>
              <input
                type="text"
                name="skillsRequired"
                value={editForm.skillsRequired}
                onChange={this.handleEditChange}
                className="form-input"
                placeholder="e.g., Machine Learning, AWS, Design"
              />
            </div>
            <div className="form-actions">
              <button className="save-btn" onClick={this.handleSaveEdit}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={this.handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
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
        )}
        
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

function ProfileWithParams(props) {
  const params = useParams();
  return <Profile {...props} params={params} />;
}

export default ProfileWithParams;
