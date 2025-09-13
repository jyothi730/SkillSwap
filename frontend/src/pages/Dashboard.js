import React, { Component } from "react";
import axios from "axios";
import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      activity: [],
      recommendations: [],
      skills: { offer: [], want: [] },
      loading: true,
      error: null,
    };
  }
  async componentDidMount() {
    try {
      const token = localStorage.getItem("token"); // after login you must save token
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // fetch all required data
      const [meRes, requestsRes, matchesRes] = await Promise.all([
        axios.get("/api/users/me", config),
        axios.get("/api/requests", config),
        axios.get("/api/users/me/matches", config),
      ]);

      const me = meRes.data;
      const requests = requestsRes.data;
      const matches = matchesRes.data;

      this.setState({
        userData: me,
        activity: requests,
        recommendations: matches,
        skills: {
          offer: me.skillsOffered || [],
          want: me.skillsRequired || [],
        },
        loading: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        loading: false,
        error: "Failed to load dashboard",
      });
    }
  }

  render() {
    const { userData, activity, recommendations, skills, loading, error } =
      this.state;

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
            <h2>Welcome back, {userData.name}! 👋</h2>
            <p>Ready to learn something new or share your expertise?</p>
          </div>
          <button className="find-matches-btn">🔍 Find Matches</button>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stat-card green">
            <h3>Credits</h3>
            <p className="stat-value">{userData.credits}</p>
            <small>Earn more by teaching skills</small>
          </div>
          <div className="stat-card blue">
            <h3>Matches Found</h3>
            <p className="stat-value">{recommendations.length}</p>
            <small>+ new this week</small>
          </div>
          <div className="stat-card purple">
            <h3>Skill Rating</h3>
            <p className="stat-value">⭐</p>
            <small>(future: average feedback)</small>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="two-column">
          <div className="card">
            <h3>Recent Activity</h3>
            <p>Your latest skill exchange activities</p>
            <ul className="activity-list">
              {activity.map((req) => (
                <li key={req._id}>
                  <b>{req.receiver.name}</b> — {req.skillRequired}
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </li>
              ))}
            </ul>
            <button className="view-btn">View All Activity</button>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3>Recommended for You</h3>
            <p>People who match your learning goals</p>
            <ul className="recommend-list">
              {recommendations.map((r) => (
                <li key={r._id}>
                  <b>{r.name}</b> —{" "}
                  {[...(r.offeredMatch || []), ...(r.requiredMatch || [])].join(
                    ", "
                  )}
                  <span className="match">{r.score * 20}% match</span>
                  <button>Connect</button>
                </li>
              ))}
            </ul>
            <button className="view-btn">Explore All Matches</button>
          </div>
        </div>

        {/* Skills */}
        <div className="two-column">
          <div className="card">
            <h3>Skills You Offer</h3>
            <div className="skills">
              {skills.offer.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <button className="view-btn">Manage Skills</button>
          </div>

          <div className="card">
            <h3>Skills You Want</h3>
            <div className="skills blue">
              {skills.want.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <button className="view-btn">Update Learning Goals</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
