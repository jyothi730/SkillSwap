const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMatches,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);

// Private
router.get("/me", protect, getMe);
router.get("/me/matches", protect, getMatches);

// Dynamic by-id routes
router.get("/:id", getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);


module.exports = router;
