const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const accountController = require('../controller/accountController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const validateCreateAccount = [
    body('account_id').notEmpty().withMessage('Account ID is required'),
    body('account_name').notEmpty().withMessage('Account name is required'),
    body('website').notEmpty().withMessage('Website is required'),
        (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

const validateAccountIdParam = [
    param('id').notEmpty().withMessage('Account ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

const validateUpdateAccount = [
    param('id').notEmpty().withMessage('Account ID is required'),
    body('account_name').notEmpty().withMessage('Account name is required'),
    body('website').notEmpty().withMessage('Website is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

const validateSearchAccount = [
    body('account_name').notEmpty().withMessage('Account name is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }];

router.post('/', authenticateToken, authorizeRole('admin'), validateCreateAccount, accountController.createAccount)
router.get('/', authenticateToken, accountController.getAccount);
router.get('/:id', authenticateToken,validateAccountIdParam, accountController.getAccountById);
router.put('/:id', authenticateToken, validateUpdateAccount, accountController.updateAccount);
router.delete('/:id', authenticateToken, authorizeRole('admin'), accountController.deleteAccount);
router.post('/search',authenticateToken,validateSearchAccount, accountController.searchAccounts);
module.exports = router;