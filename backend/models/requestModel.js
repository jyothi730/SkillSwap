const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillOffered: { type: String, required: true },
  skillWanted: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  scheduledDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
