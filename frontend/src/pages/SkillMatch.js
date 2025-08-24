import React, { Component } from "react";
import axios from "axios";

class SkillMatch extends Component {
  state = {
    matches: [],
  };

  handleFindMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
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
      <div>
        <h2>Skill Match</h2>
        <button onClick={this.handleFindMatches}>Find Matches</button>

        <ul>
          {this.state.matches.map((user, idx) => (
            <li key={idx}>
              {user.name} – {user.skills.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SkillMatch;
