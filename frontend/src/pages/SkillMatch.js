import React, { Component } from "react";
import axios from "axios";

class SkillMatch extends Component {
  state = {
    skill: "",
    matches: []
  };

  handleChange = (e) => {
    this.setState({ skill: e.target.value });
  };

  handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/match",
        { skill: this.state.skill },
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
        <input
          type="text"
          placeholder="Enter skill"
          value={this.state.skill}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSearch}>Search</button>

        <ul>
          {this.state.matches.map((user, idx) => (
            <li key={idx}>{user.name} - {user.skills.join(", ")}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SkillMatch;
