const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/authenticationToken');
const { login } = require('../Controllers/LoginController');
const { createAccount } = require('../Controllers/LoginController');

// Define your routes
router.get('/login', login);
router.post('/create', createAccount);

module.exports = router;