// routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const accountRoutes = require('./accountRoutes');
const destinationRoutes = require('./destinationRoutes');
const accountMemberRoutes = require('./accountMemberRoutes');
const dataHandlerRoutes = require('./dataHanlderRoutes');
const logRoutes = require('./logRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/destinations', destinationRoutes);
router.use('/account-members', accountMemberRoutes);
router.use('/logs', logRoutes);
router.use('/users', userRoutes);
router.use('/', dataHandlerRoutes);
module.exports = router;
