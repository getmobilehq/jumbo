const express = require('express');
const router = express.Router();
const { createFieldAssessment, getAllFieldAssessments, getFieldAssessmentById, getFieldAssessmentsByBuilding, addItemsToFieldAssessment, getItemsForFieldAssessment, updateRepairCosts } = require('../controllers/fieldAssessmentController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, createFieldAssessment);
router.get('/', authenticate, getAllFieldAssessments);
router.get('/:id', authenticate, getFieldAssessmentById);
router.get('/building/:building_id', authenticate, getFieldAssessmentsByBuilding);
router.post('/:id/items', authenticate, addItemsToFieldAssessment);
router.get('/:id/items', authenticate, getItemsForFieldAssessment);
router.patch('/:id/items/costs', authenticate, updateRepairCosts);

module.exports = router;
