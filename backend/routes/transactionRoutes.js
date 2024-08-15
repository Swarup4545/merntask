// // backend/routes/transactionRoutes.js
// const express = require('express');
// const router = express.Router();
// const { fetchAndSeedData, getAllTransactions } = require('../controllers/transactionController');

// router.get('/initialize', (req, res) => {
//   fetchAndSeedData();
//   res.send('Database initialized');
// });

// router.get('/', getAllTransactions);

// module.exports = router;

// backend/routes/transactionRoutes.js
// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { fetchAndSeedData, getAllTransactions } = require('../controllers/transactionController');

// Route to initialize the database
router.get('/initialize', (req, res) => {
  fetchAndSeedData()
    .then(() => res.send('Database initialized'))
    .catch(err => res.status(500).send('Error initializing database'));
});

// Route to get all transactions with optional search and pagination
router.get('/', getAllTransactions);

module.exports = router;
