import React, { Component } from "react";
import axios from "axios";

class SkillMatch extends Component {
  state = {
    matches: [],
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
      console.error(err);
    }
  };

  render() {
    return (
      <div className="skill-container">
        <h2>Skill Match</h2>
        <button onClick={this.handleFindMatches}>Find Matches</button>
        <div className="matches">
        {this.state.matches.map((user, idx) => (
          <div key={idx} className="skills-box">
            <h3>{user.username}</h3>
            <p>Score: {user.score}</p>
            {user.offeredMatch.length > 0 && (
              <p>Matched Skills: {user.offeredMatch.join(", ")}</p>
            )}
          </div>
        ))}
        </div>
      </div>
    );
  }
}

export default SkillMatch;
