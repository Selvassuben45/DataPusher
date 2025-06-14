const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};


const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        // Check if token is blacklisted
        const isBlacklisted = await redis.get(`blacklist_${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ success: false, message: 'Token is blacklisted. Please login again.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid token.' });
    }
};
const authorizeRole = (role) => {
    return (req, res, next) => {

        if (req.user.role?.toLowerCase() !== role?.toLowerCase()) {
            return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authenticateToken,
    authorizeRole
};
