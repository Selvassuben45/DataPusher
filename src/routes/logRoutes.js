const express = require('express');
const router = express.Router();
const { Logs } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');
const logController = require('../controller/logController');
const { createLogApi } = require('../controller/logController');

router.post('/create', authenticateToken, createLogApi);
router.get('/', authenticateToken, logController.getLogs);
router.post('/search',authenticateToken, logController.searchLogs);
module.exports = router;
