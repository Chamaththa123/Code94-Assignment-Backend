const express = require("express");
const { register, login } = require("../controllers/userController");

const router = express.Router();

// Route to user registration
router.post("/register", register);

// Route to user login
router.post("/login", login);

module.exports = router;
