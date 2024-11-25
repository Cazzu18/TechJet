const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/authenticationToken');
const { login, createAccount, viewUserProfile, updateUserProfile } = require('../Controllers/UserController');

router.get('/login', login);
router.post('/create', createAccount);
router.get('/profile', authenticateToken, viewUserProfile); //authenticated routes need to have the user token stored in the request header as Authorization: Bearer INSERT_TOKEN_HERE
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router;