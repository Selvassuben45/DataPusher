// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { inviteUser, acceptInvite } = require('../controller/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/invite', inviteUser);
router.post('/accept-invite', acceptInvite);

module.exports = router;
