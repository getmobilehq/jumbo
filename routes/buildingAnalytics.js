/**
 * Building Analytics Routes
 * Provides routes for building statistics and analytics
 */
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const buildingAnalyticsController = require('../controllers/buildingAnalyticsController');

// Get analytics summary for all buildings
router.get('/summary', authenticate, buildingAnalyticsController.getBuildingAnalytics);

// Get buildings by type
router.get('/by-type/:type', authenticate, buildingAnalyticsController.getBuildingsByType);

// Get buildings by state
router.get('/by-state/:state', authenticate, buildingAnalyticsController.getBuildingsByState);

module.exports = router;
