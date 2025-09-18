import React, { Component } from "react";
import axios from "axios";
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
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch current user
      const userRes = await axios.get("/api/users/me", { headers });

      // Fetch skill matches
      const matchesRes = await axios.get("/api/users/me/matches", { headers });

      // Fetch requests
      const requestsRes = await axios.get("/api/requests", { headers });

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
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

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

      await axios.put(`/api/users/${this.state.user._id}`, updatedUser, {
        headers,
      });

      this.setState({ user: updatedUser });
    } catch (err) {
      alert("Failed to update skills");
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
          <button className="find-matches-btn">Find Matches</button>
        </div>

        {/* Matches */}
        <section>
          <h3>Recommended Matches</h3>
          {matches.length > 0 ? (
            <ul>
              {matches.map((m) => (
                <li key={m._id}>
                  {m.name} – Skills you need: {m.offeredMatch?.join(", ")} | Skills they
                  need: {m.requiredMatch?.join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p>No matches found yet.</p>
          )}
        </section>

        {/* Skills */}
        <div className="two-column">
          <div className="card">
            <h3>Skills You Offer</h3>
            <div className="skills">
              {user?.skillsOffered?.length > 0 ? (
                user.skillsOffered.map((s, i) => <span key={i}>{s}</span>)
              ) : (
                <p>No offered skills yet</p>
              )}
            </div>
            <button
              className="view-btn"
              onClick={() => this.handleUpdateSkills("offered")}
            >
              Manage Skills
            </button>
          </div>

          <div className="card">
            <h3>Skills You Want</h3>
            <div className="skills blue">
              {user?.skillsRequired?.length > 0 ? (
                user.skillsRequired.map((s, i) => <span key={i}>{s}</span>)
              ) : (
                <p>No learning goals yet</p>
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

        {/* Recent Requests */}
        <div className="card">
          <h3>Recent Requests</h3>
          {requests.length > 0 ? (
            <ul>
              {requests.map((r) => (
                <li key={r._id}>
                  {r.sender?.name} → {r.receiver?.name} | {r.skillOffered} ↔{" "}
                  {r.skillRequired} | {r.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent requests</p>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
