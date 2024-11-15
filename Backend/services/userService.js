// services/userService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

require("dotenv").config();

// Register a new user
const registerUser = async (username, password) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error registering user");
  }
};

// Login an existing user
const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    if (!password || !user.password) throw new Error("Password is required");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.secret_key, {
      expiresIn: "1h",
    });

    return { token, user: user.username };
  } catch (error) {
    throw new Error("Error logging in user");
  }
};

module.exports = { registerUser, loginUser };
