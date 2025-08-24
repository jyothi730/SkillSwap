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
router.get("/:id", getUserById);

// Private
router.get("/me/profile", protect, getMe);
router.post("/me/matches", protect, getMatches);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);


module.exports = router;
