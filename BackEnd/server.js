const express = require('express');
const app = express();
require('dotenv').config();

const { connection } = require('./Database/db');  // Your DB connection function
const userRouter = require('./routes/userRoute'); // Your user routes

const cors = require('cors');

app.use(cors());
app.use(express.json());

// Mount user routes at /api/users
app.use('/api/users', userRouter);

// Simple root test route
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

// Connect to DB and then start server
connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB', err);
  });
