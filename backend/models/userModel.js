const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        skillsOffered: {
            type: [String], // Example: ["Web Development", "Photography"]
            default: []
        },
        skillsWanted: {
            type: [String], // Example: ["Graphic Design", "Cooking"]
            default: []
        }
    },
    {
        timestamps: true // Automatically adds createdAt & updatedAt
    }
);

module.exports = mongoose.model("User", userSchema);
