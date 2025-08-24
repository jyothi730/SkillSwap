const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// @desc Register new user
// @route POST /api/users/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, skillsOffered, skillsWanted } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password, // hashed in pre('save')
      skillsOffered,
      skillsWanted,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      credits: user.credits,
      token: genToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      credits: user.credits,
      token: genToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current user
// @route GET /api/users/me
// @access Private
const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc Get all users
// @route GET /api/users
// @access Public (you can later make it Private)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single user by ID
// @route GET /api/users/:id
// @access Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user by ID
// @route PUT /api/users/:id
// @access Private (owner-only)
const updateUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // If password is included, allow hash on save by using document.save()
    const updates = { ...req.body };
    if ("password" in updates) {
      const user = await User.findById(req.params.id).select("+password");
      if (!user) return res.status(404).json({ message: "User not found" });

      user.name = updates.name ?? user.name;
      user.email = updates.email ?? user.email;
      user.skillsOffered = updates.skillsOffered ?? user.skillsOffered;
      user.skillsWanted = updates.skillsWanted ?? user.skillsWanted;
      user.password = updates.password ?? user.password;

      const saved = await user.save();
      const clean = saved.toObject();
      delete clean.password;
      return res.status(200).json(clean);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete user by ID
// @route DELETE /api/users/:id
// @access Private (owner-only or admin later)
const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMatches = async (req, res) => {
  try {
    const matches = await User.find({
      skillsOffered: { $in: req.user.skillsWanted },
      _id: { $ne: req.user._id }
    }).select("-password");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
