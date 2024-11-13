const mongoose = require("mongoose");
require("dotenv").config();

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connecting to MongoDB using provided URI
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB"); // Logging success message
  } catch (error) {
    console.error("Error connecting to MongoDB:", error); // Logging error message
  }
};

module.exports = connectDB;