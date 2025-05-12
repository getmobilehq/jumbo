const express = require('express');
const router = express.Router();
const { getAllBuildingTypes, getBuildingTypeByType, uploadBuildingTypesFromCSV } = require('../controllers/buildingTypeController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', authenticate, getAllBuildingTypes);
router.get('/:type', authenticate, getBuildingTypeByType);
router.post('/upload', authenticate, upload.single('file'), uploadBuildingTypesFromCSV);

module.exports = router;
