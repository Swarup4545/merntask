// // backend/controllers/transactionController.js
// const axios = require('axios');
// const Transaction = require('../models/Transaction');

// const fetchAndSeedData = async () => {
//   try {
//     const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
//     const transactions = response.data;

//     await Transaction.deleteMany({});
//     await Transaction.insertMany(transactions);
//     console.log('Database initialized');
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

// const getAllTransactions = async (req, res) => {
//   try {
//     const { month, search = '', page = 1, perPage = 10 } = req.query;
//     const startOfMonth = new Date(`2024-${month}-01`);
//     const endOfMonth = new Date(startOfMonth);
//     endOfMonth.setMonth(endOfMonth.getMonth() + 1);

//     const query = {
//       dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
//       $or: [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { price: { $regex: search, $options: 'i' } },
//       ]
//     };

//     const transactions = await Transaction.find(query)
//       .skip((page - 1) * perPage)
//       .limit(perPage);

//     const totalCount = await Transaction.countDocuments(query);
//     res.json({ transactions, totalCount });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { fetchAndSeedData, getAllTransactions };

// backend/controllers/transactionController.js
const axios = require('axios');
const Transaction = require('../models/Transaction');

const fetchAndSeedData = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data.map(item => ({
      ...item,
      dateOfSale: new Date(item.dateOfSale),
      price: parseFloat(item.price) // Ensure price is stored as a number
    }));

    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const { month, search = '', page = 1, perPage = 10 } = req.query;

    // Validate month parameter
    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ message: 'Invalid month' });
    }

    const startOfMonth = new Date(`2024-${month.padStart(2, '0')}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const query = {
      dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        // Convert price to a number if it contains only digits
        { price: search.match(/^\d+$/) ? { $regex: search, $options: 'i' } : { $exists: true } }
      ]
    };

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const totalCount = await Transaction.countDocuments(query);
    res.json({ transactions, totalCount });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { fetchAndSeedData, getAllTransactions };
