// controllers/dataHandlerController.js
const { Account, Destination, Log } = require('../models');
const { v4: uuidv4 } = require('uuid');

const queue = require('../config/queue');
const redis = require('../config/redis');
// const handleIncomingData = async (req, res) => {
//   try {
//         const { userId, action, details } = req.body;

//         let appSecretToken = req.headers['cl-x-token'];
//         let eventId = req.headers['cl-x-event-id'];

//         if (!appSecretToken) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'CL-X-TOKEN header is required'
//             });
//         }

//         const isBlacklisted = await redis.get(`bl_${appSecretToken}`);
//         if (isBlacklisted) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid or expired token'
//             });
//         }

//         if (!eventId) {
//             eventId = uuidv4();
//         }

//         const account = await Account.findOne({ where: { app_secret_token: appSecretToken } });

//         if (!account) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid app secret token'
//             });
//         }

//         await queue.add('push-data', {
//             accountId: account.account_id,
//             eventId,
//             data: req.body
//         });
// console.log('Adding job to queue for account:', account.account_id);
//         return res.status(200).json({
//             success: true,
//             message: 'Data Received and Queued',
//         });

//     } catch (error) {
//         console.error('Error processing incoming data:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Server Error'
//         });
//     }
// };

const handleIncomingData = async (req, res) => {
    try {
        const { userId, action, details } = req.body;

        let appSecretToken = req.headers['cl-x-token'];
        let eventId = req.headers['cl-x-event-id'];

        if (!appSecretToken) {
            return res.status(400).json({
                success: false,
                message: 'CL-X-TOKEN header is required'
            });
        }

        const isBlacklisted = await redis.get(`bl_${appSecretToken}`);
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        if (!eventId) {
            eventId = uuidv4();
        }

        const account = await Account.findOne({ where: { app_secret_token: appSecretToken } });

        if (!account) {
            return res.status(401).json({
                success: false,
                message: 'Invalid app secret token'
            });
        }

        // ✅ Pass direct data without nesting
        await queue.add('push-data', {
            accountId: account.account_id,
            eventId: eventId,
            userId: userId,
            action: action,
            details: details
        });

        console.log('Adding job to queue for account:', account.account_id);

        return res.status(200).json({
            success: true,
            message: 'Data Received and Queued'
        });

    } catch (error) {
        console.error('Error processing incoming data:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
module.exports = { handleIncomingData };
