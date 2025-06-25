// server.js
const express = require('express');
const app = express();
require('dotenv').config();

const { connectDB } = require('./db/connection'); // Sequelize connection & sync
const authRouter = require('./routes/auth'); // Auth routes

// Middleware to parse JSON requests
app.use(express.json());

// Use auth routes
app.use(authRouter);

// Optional: test route
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

// Connect DB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
  });
