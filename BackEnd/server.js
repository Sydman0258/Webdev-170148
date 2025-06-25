const express = require('express');
const app = express();
require('dotenv').config();

const { connection } = require('./Database/db'); 
const authRouter = require('./routes/auth');

const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use(authRouter);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB', err);
  });
