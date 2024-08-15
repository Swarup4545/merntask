// backend/controllers/chartController.js
const Transaction = require('../models/Transaction');

const getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const results = await Promise.all(ranges.map(async range => {
      return {
        range: `${range.min} - ${range.max}`,
        count: await Transaction.countDocuments({
          dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
          price: { $gte: range.min, $lte: range.max }
        })
      };
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBarChartData, getPieChartData };
