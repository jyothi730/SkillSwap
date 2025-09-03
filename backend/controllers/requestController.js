const Request = require("../models/requestModel");

const createRequest = async (req, res) => {
  try {
    const { receiver, skillOffered, skillRequired, scheduledDate } = req.body;

    const request = await Request.create({
      sender: req.user._id,
      receiver,
      skillOffered,
      skillRequired,
      scheduledDate
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).populate("sender receiver", "name email skillsOffered skillsRequired").sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (!request.receiver.equals(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    request.status = req.body.status || request.status;
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createRequest, getRequests, updateRequestStatus };
