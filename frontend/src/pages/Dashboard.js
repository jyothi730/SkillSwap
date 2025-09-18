import React, { Component } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      matches: [],
      requests: [],
      loading: true,
      error: "",
    };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      // Fetch current user
      const userRes = await API.get("/users/me");

      // Fetch skill matches
      const matchesRes = await API.get("/users/me/matches");

      // Fetch requests
      const requestsRes = await API.get("/requests");

      this.setState({
        user: userRes.data,
        matches: matchesRes.data,
        requests: requestsRes.data,
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: err.response?.data?.message,
        loading: false,
      });
    }
  }

  // Add or update user skills
  handleUpdateSkills = async (type) => {
    try {
      const newSkill = prompt(
        `Enter a ${type === "offered" ? "skill you offer" : "skill you want"}`
      );
      if (!newSkill) return;

      const updatedUser = {
        ...this.state.user,
        [type === "offered" ? "skillsOffered" : "skillsRequired"]: [
          ...(this.state.user[
            type === "offered" ? "skillsOffered" : "skillsRequired"
          ] || []),
          newSkill,
        ],
      };
      await API.put(`/users/${this.state.user._id}`, updatedUser);

      this.setState({ user: updatedUser });
    } catch (err) {
      alert("Failed to update skills");
    }
  };

  handleUpdateRequestStatus = async (requestId, status) => {
    try {
      await API.put(`/requests/${requestId}`, { status });
      const requestsRes = await API.get("/requests");
      this.setState({ requests: requestsRes.data });
    } catch (err) {
      alert("Failed to update request");
    }
  };

  render() {
    const { user, matches, requests, loading, error } = this.state;

    if (loading) {
      return <div className="loader">Loading dashboard...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    return (
      <div className="dashboard-container">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div>
            <h2>Welcome back, {user?.name}!</h2>
            <p>Ready to learn something new or share your expertise?</p>
          </div>
          <Link to="/match" className="find-matches-btn">Find Matches</Link>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-content">
          {/* Skills You Offer */}
          <div className="card">
            <h3>Skills You Offer</h3>
            <div className="skills">
              {user?.skillsOffered?.length > 0 ? (
                user.skillsOffered.map((s, i) => <span key={i}>{s}</span>)
              ) : (
                <div className="empty-state">
                  <p>No offered skills yet</p>
                </div>
              )}
            </div>
            <button
              className="view-btn"
              onClick={() => this.handleUpdateSkills("offered")}
            >
              Manage Skills
            </button>
          </div>

          {/* Skills You Want */}
          <div className="card">
            <h3>Skills You Want</h3>
            <div className="skills blue">
              {user?.skillsRequired?.length > 0 ? (
                user.skillsRequired.map((s, i) => <span key={i}>{s}</span>)
              ) : (
                <div className="empty-state">
                  <p>No learning goals yet</p>
                </div>
              )}
            </div>
            <button
              className="view-btn"
              onClick={() => this.handleUpdateSkills("required")}
            >
              Update Learning Goals
            </button>
          </div>
        </div>

        {/* Recommended Matches */}
        <div className="card matches-section">
          <h3>Recommended Matches</h3>
          {matches.length > 0 ? (
            <ul className="matches-list">
              {matches.map((m) => (
                <li key={m._id}>
                  <div className="match-name">{m.name}</div>
                  <div className="match-skills">
                    <strong>Skills you need:</strong> {m.offeredMatch?.join(", ")}<br/>
                    <strong>Skills they need:</strong> {m.requiredMatch?.join(", ")}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No matches found yet. Add some skills to find potential matches!</p>
            </div>
          )}
        </div>

        {/* Recent Requests */}
        <div className="card requests-section">
          <h3>Recent Requests</h3>
          {requests.length > 0 ? (
            <ul className="requests-list">
              {requests.map((r) => (
                <li key={r._id}>
                  <div className="request-info">
                    <div className="request-participants">
                      {r.sender?.name} → {r.receiver?.name}
                    </div>
                    <div className="request-skills">
                      {r.skillOffered} ↔ {r.skillRequired}
                    </div>
                  </div>
                  <div className={`request-status ${r.status}`}>
                    {r.status}
                  </div>
                  {user && r.receiver?._id === user._id && r.status === "pending" && (
                    <span style={{ marginLeft: 12 }}>
                      <button className="view-btn" onClick={() => this.handleUpdateRequestStatus(r._id, "accepted")}>
                        Accept
                      </button>
                      <button className="view-btn" style={{ marginLeft: 8 }} onClick={() => this.handleUpdateRequestStatus(r._id, "rejected")}>
                        Reject
                      </button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No recent requests</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
