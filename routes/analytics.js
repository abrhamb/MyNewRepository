const express = require('express');
const {
  getDashboardStats,
  getCampaignAnalytics,
  getSegmentAnalytics,
  getEngagementTrends,
  getRevenueAnalytics
} = require('../controllers/analyticsController');

const router = express.Router();

// Routes
router.get('/dashboard', getDashboardStats);
router.get('/campaigns', getCampaignAnalytics);
router.get('/segments', getSegmentAnalytics);
router.get('/engagement', getEngagementTrends);
router.get('/revenue', getRevenueAnalytics);

module.exports = router;