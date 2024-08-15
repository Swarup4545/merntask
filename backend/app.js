// // backend/app.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = 5001 || process.env.PORT;

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

  
//   const fetchAndSeedData = async () => {
//     try {
//       const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
//       const transactions = response.data;
  
//       await Transaction.deleteMany({});
//       await Transaction.insertMany(transactions);
//       console.log('Database initialized');
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };  
//   fetchAndSeedData()  
// // Routes
// app.use('/api/transactions', require('./routes/transactionRoutes'));
// app.use('/api/stats', require('./routes/statsRoutes'));
// app.use('/api/charts', require('./routes/chartRoutes'));

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// backend/app.js

//second 

// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const Transaction = require('./models/Transaction'); // Import the Transaction model

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001; // Correct fallback for PORT

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Fetch and seed data
const fetchAndSeedData = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;

    // Process and seed data
    const transactions = data.map(item => ({
      ...item,
      dateOfSale: new Date(item.dateOfSale) // Ensure date is converted to Date object
    }));

    // Clear existing data
    await Transaction.deleteMany({});
    // Seed new data
    await Transaction.insertMany(transactions);

    console.log('Data seeded successfully.');
  } catch (error) {
    console.error('Error fetching or seeding data:', error);
  }
};

fetchAndSeedData();

// Routes

app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/charts', require('./routes/chartRoutes'));

// Global error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
