const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const { connection } = require('./Database/db');  // Your DB connection function
const userRouter = require('./routes/userRoute');
const rentalRouter = require('./routes/rentalRoute');

const cors = require('cors');

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount user routes at /api/users
app.use('/api/users', userRouter);

// Rental routes (e.g., /api/rent)
app.use('/api', rentalRouter); 

app.use('/api/rentals', rentalRouter);

const contactRouter = require('./routes/contactRoute');
app.use('/api/contact', contactRouter);  // <- this registers the route


app.get('/', (req, res) => {
  res.send('API is running');
});
const authRouter = require('./routes/auth'); 
app.use('/api/auth', authRouter);           


const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB', err);
  });

  