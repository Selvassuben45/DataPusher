const express = require('express');
const router = express.Router();

const accountMemberController = require('../controller/accountMemberController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { body, param, validationResult } = require('express-validator');

const validateAddMember = [
    body('account_id').notEmpty().withMessage('Account ID is required'),
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('role_id').notEmpty().withMessage('Role ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

const validateGetMembers = [
    param('account_id').notEmpty().withMessage('Account ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];
router.post('/', authenticateToken, authorizeRole('admin'), validateAddMember,accountMemberController.addMember);
router.get('/:account_id', authenticateToken,validateGetMembers, accountMemberController.getMembers);
module.exports = router;