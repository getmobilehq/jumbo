const express = require('express');
const router = express.Router();
const { createPreAssessment, getAllPreAssessments, getPreAssessmentById, getPreAssessmentsByBuilding, addItemsToPreAssessment, getItemsForPreAssessment } = require('../controllers/preAssessmentController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, createPreAssessment);
router.get('/', authenticate, getAllPreAssessments);
router.get('/:id', authenticate, getPreAssessmentById);
router.get('/building/:building_id', authenticate, getPreAssessmentsByBuilding);
router.post('/:id/items', authenticate, addItemsToPreAssessment);
router.get('/:id/items', authenticate, getItemsForPreAssessment);

module.exports = router;
