const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateAdmin } = require('../Middleware/authenticationToken');
const { login, createAccount, viewUserProfile, updateUserProfile, adminGetUser, adminAlterUser, adminDeleteUser } = require('../Controllers/UserController');

router.get('/login', login);
router.post('/create', createAccount);
router.get('/profile', authenticateToken, viewUserProfile); //authenticated routes need to have the user token stored in the request header as Authorization: Bearer INSERT_TOKEN_HERE
router.put('/profile', authenticateToken, updateUserProfile);
router.get('/user/:user_id', authenticateToken, authenticateAdmin, adminGetUser);
router.put('/user/:user_id', authenticateToken, authenticateAdmin, adminAlterUser);
router.delete('/user/:user_id', authenticateToken, authenticateAdmin, adminDeleteUser);
module.exports = router;