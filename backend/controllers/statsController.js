// backend/controllers/statsController.js
const Transaction = require('../models/Transaction');

const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const totalSales = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startOfMonth, $lt: endOfMonth }, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: "$price" }, totalSoldItems: { $sum: 1 } } }
    ]);

    const totalSoldItems = totalSales[0]?.totalSoldItems || 0;
    const totalAmount = totalSales[0]?.totalAmount || 0;

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
      sold: false
    });

    res.json({ totalAmount, totalSoldItems, totalNotSoldItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStatistics };
