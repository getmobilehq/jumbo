const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateBody, schemas } = require('../utils/validator');

router.post('/register', validateBody(schemas.register), register);
router.post('/login', validateBody(schemas.login), login);

module.exports = router;
