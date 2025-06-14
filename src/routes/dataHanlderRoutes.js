const express = require('express');
const router = express.Router();

const { handleIncomingData } = require('../controller/dataHandlerController');
const rateLimit = require('express-rate-limit');

const incomingDataLimiter = rateLimit({
    windowMs: 1000,
    max: 5,
    keyGenerator: (req) => req.body.account_id || req.ip,
    message: 'Too many requests, please try again later.'
});

router.post('/server/incoming_data', incomingDataLimiter, handleIncomingData);

module.exports = router;
