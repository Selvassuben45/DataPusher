const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

const validateLogout = [
    (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ success: false, message: 'Authorization token is required' });
        }
        next();
    }
];
router.post('/register',validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', validateLogout, authController.logout);
module.exports = router;
