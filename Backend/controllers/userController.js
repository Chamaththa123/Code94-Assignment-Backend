const userDBService = require("../services/userService");

// Register a new user
const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userDBService.registerUser(username, password);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login an existing user
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await userDBService.loginUser(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };
