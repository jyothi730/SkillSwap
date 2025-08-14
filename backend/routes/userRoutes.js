const express = require("express");
const { registerUser, getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

router.post("/", registerUser); // Register a user
router.get("/", getUsers); // Get all users
router.get("/:id", getUserById);       // Get single user
router.put("/:id", updateUser);        // Update user
router.delete("/:id", deleteUser);     // Delete user

module.exports = router;
