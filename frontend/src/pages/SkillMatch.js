import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./skillMatch.css"

class SkillMatch extends Component {
  state = {
    matches: [],
    searchLocation: "",
    sortOrder: "desc",
  };

  handleSearchChange = (e) => {
    this.setState({ searchLocation: e.target.value });
  };

  handleSortChange = (e) => {
    this.setState({ sortOrder: e.target.value });
  };

  handleFindMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/users/me/matches",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.setState({ matches: res.data });
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  render() {
    const { matches, searchLocation, sortOrder } = this.state;

    // Filter by location (case-insensitive)
    let filteredMatches = matches.filter((user) =>
      user.location?.toLowerCase().includes(searchLocation.toLowerCase())
    );

    // Sort by score
    filteredMatches.sort((a, b) =>
      sortOrder === "asc" ? a.score - b.score : b.score - a.score
    );

    return (
      <div className="skill-container">
        <h2>Skill Match</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by location"
            value={searchLocation}
            onChange={this.handleSearchChange}
          />
          <select value={sortOrder} onChange={this.handleSortChange}>
            <option value="desc">Sort by Score (High → Low)</option>
            <option value="asc">Sort by Score (Low → High)</option>
          </select>
        </div>
        <button onClick={this.handleFindMatches}>Find Matches</button>
        <div className="matches">
          {filteredMatches.length === 0 ? (
            <p>No matches found</p>
          ) : (
            filteredMatches.map((user, idx) => (
              <div key={idx} className="skills-box">
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Score: {user.score}</p>
                <p>Location: {user.location || "Not provided"}</p>

                {user.offeredMatch?.length > 0 && (
                  <p>
                    They can offer you:{" "}
                    <strong>{user.offeredMatch.join(", ")}</strong>
                  </p>
                )}
                {user.requiredMatch?.length > 0 && (
                  <p>
                    They need from you:{" "}
                    <strong>{user.requiredMatch.join(", ")}</strong>
                  </p>
                )}

                <Link to={`/profile/${user._id}`} className="profile-link">
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
