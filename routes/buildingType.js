const express = require('express');
const router = express.Router();
const { getAllBuildingTypes, getBuildingTypeByType } = require('../controllers/buildingTypeController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getAllBuildingTypes);
router.get('/:type', authenticate, getBuildingTypeByType);

module.exports = router;
