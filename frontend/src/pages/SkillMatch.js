import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./skillMatch.css";

class SkillMatch extends Component {
  state = {
    matches: [],
    searchText: "",
    locationFilter: "all",
    skillFilter: "all",
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.handleFindMatches();
  }

  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  handleLocationChange = (e) => {
    this.setState({ locationFilter: e.target.value });
  };

  handleSkillChange = (e) => {
    this.setState({ skillFilter: e.target.value });
  };

  handleFindMatches = async () => {
    try {
      this.setState({ loading: true, error: null });
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/me/matches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setState({ matches: res.data, loading: false });
    } catch (err) {
      console.error("Error fetching matches:", err);
      this.setState({ error: "Failed to fetch matches", loading: false });
    }
  };

  render() {
    const { matches, searchText, locationFilter, skillFilter, loading, error } =
      this.state;

    // Filtering logic
    let filteredMatches = matches.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.skills?.some((s) =>
          s.toLowerCase().includes(searchText.toLowerCase())
        );

      const matchesLocation =
        locationFilter === "all" ||
        user.location?.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesSkill =
        skillFilter === "all" ||
        user.skills?.some((s) =>
          s.toLowerCase().includes(skillFilter.toLowerCase())
        );

      return matchesSearch && matchesLocation && matchesSkill;
    });

    return (
      <div className="skillmatch-container">
        <h1 className="page-title">Find Your Perfect Skill Match</h1>
        <p className="subtitle">
          Connect with others who can teach you new skills while learning from
          your expertise
        </p>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or skills..."
            value={searchText}
            onChange={this.handleSearchChange}
          />
          <select value={locationFilter} onChange={this.handleLocationChange}>
            <option value="all">All Locations</option>
            <option value="hyd">Hyderabad</option>
            <option value="bangalore">Bangalore</option>
            <option value="vjy">Vijayawada</option>
            <option value="vizag">Vizag</option>
            <option value="gurgaon">Gurgaon</option>
            <option value="us">US</option>
          </select>
          <select value={skillFilter} onChange={this.handleSkillChange}>
            <option value="all">All Skills</option>
            <option value="ui/ux design">UI/UX Design</option>
            <option value="aws">AWS</option>
            <option value="cloud architecture">Cloud Architecture</option>
            <option value="devops">DevOps</option>
            <option value="product management">Product Management</option>
            <option value="python">Python</option>
            <option value="data analysis">Data Analysis</option>
            <option value="machine learning">Machine Learning</option>
            <option value="react">React</option>
          </select>
        </div>

        {/* Results */}
        {loading && <p className="loading">Loading matches...</p>}
        {error && <p className="error">{error}</p>}

        <h3 className="matches-count">{filteredMatches.length} matches found</h3>

        <div className="matches-grid">
          {filteredMatches.length === 0 ? (
            <p>No matches found</p>
          ) : (
            filteredMatches.map((user, idx) => (
              <div key={idx} className="match-card">
                <div className="user-info">
                  <div className="user-style">
                    <div className="avatar">{user.name?.[0] || "U"}</div>
                    <div>
                      <h4>{user.name}</h4>
                      <p className="location">{user.location || "Unknown"}</p>
                    </div>
                  </div>
                  <span className="score">
                    ⭐ {user.score || 0}% <small>match</small>
                  </span>
                </div>

                <div className="skills-section">
                  {user.offeredMatch?.length > 0 && (
                    <div>
                      <p className="label">Can teach you:</p>
                      <div className="skill-tags">
                        {user.offeredMatch.map((s, i) => (
                          <span key={i}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {user.requiredMatch?.length > 0 && (
                    <div>
                      <p className="label">You can teach:</p>
                      <div className="skill-tags blue">
                        {user.requiredMatch.map((s, i) => (
                          <span key={i}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link to={`/profile/${user._id}`} className="profile-btn">
                  View Profile
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default SkillMatch;
