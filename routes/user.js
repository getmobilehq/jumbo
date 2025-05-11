const express = require('express');
const router = express.Router();
const { getMe, getAllUsers, getUserById, deleteUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/me', authenticate, getMe);
router.get('/', authenticate, authorize(['admin']), getAllUsers);
router.get('/:id', authenticate, authorize(['admin']), getUserById);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router;
