const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const productRoutes = require('./routes/productRoutes');

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const corsOptions = {
    origin: "*",
  };
  
  app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
