const express = require('express');
const router = express.Router();
const { createBuilding, getAllBuildings, getBuildingById, updateBuilding, deleteBuilding } = require('../controllers/buildingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const { validateBody, schemas } = require('../utils/validator');

router.post('/', authenticate, authorize(['admin']), validateBody(schemas.building), createBuilding);
router.get('/', authenticate, getAllBuildings);
router.get('/:id', authenticate, getBuildingById);
router.patch('/:id', authenticate, authorize(['admin']), updateBuilding);
router.delete('/:id', authenticate, authorize(['admin']), deleteBuilding);

module.exports = router;
