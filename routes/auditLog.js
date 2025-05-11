const express = require('express');
const router = express.Router();
const { getAllAuditLogs, getAuditLogById } = require('../controllers/auditLogController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, authorize(['admin']), getAllAuditLogs);
router.get('/:id', authenticate, authorize(['admin']), getAuditLogById);

module.exports = router;
