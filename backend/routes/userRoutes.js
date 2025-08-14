const express = require("express");
const { registerUser, getUsers } = require("../controllers/userController");

const router = express.Router();

router.post("/", registerUser); // Register a user
router.get("/", getUsers); // Get all users

module.exports = router;
