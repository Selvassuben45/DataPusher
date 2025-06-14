const { body, validationResult } = require('express-validator');

const validateDestinationCreation = [
    body('url').notEmpty().withMessage('URL is required'),
    body('http_method').notEmpty().withMessage('HTTP Method is required'),
    body('headers').isObject().withMessage('Headers must be an object'),
    body('AccountId').notEmpty().withMessage('AccountId is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Invalid Data', errors: errors.array() });
        }
        next();
    }
];

const validateDestinationUpdate = [
    body('AccountId').notEmpty().withMessage('AccountId is required for update'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Invalid Data', errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateDestinationCreation, validateDestinationUpdate };
