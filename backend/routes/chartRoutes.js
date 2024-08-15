// backend/routes/chartRoutes.js
const express = require('express');
const router = express.Router();
const { getBarChartData, getPieChartData } = require('../controllers/chartController');

router.get('/bar', getBarChartData);
router.get('/pie', getPieChartData);

module.exports = router;
