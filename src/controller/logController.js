const { Log, Account, Destination } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const redis = require('../config/redis');
const createLog = async (logData) => {
    return await Log.create(logData);
};

const createLogApi = async (req, res) => {
    try {
        const { AccountId, DestinationId, received_timestamp, processed_timestamp, received_data, status } = req.body;

        if (!AccountId || !DestinationId || !status) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const event_id = uuidv4();
        const account = await Account.findOne({ where: { account_id: AccountId } });
        if (!account) {
            return res.status(404).json({ success: false, message: `AccountId ${AccountId} does not exist` });
        }

        const destination = await Destination.findOne({ where: { id: DestinationId } });
        if (!destination) {
            return res.status(404).json({ success: false, message: `DestinationId ${DestinationId} does not exist` });
        }

        const newLog = await createLog({
            event_id,
            AccountId,
            DestinationId,
            received_timestamp: received_timestamp ? new Date(received_timestamp) : new Date(),
            processed_timestamp: processed_timestamp ? new Date(processed_timestamp) : new Date(),
            received_data,
            status
        });

        console.log(newLog);

        return res.status(200).json({
            success: true,
            message: 'Log created successfully',
        });

    } catch (error) {
        console.log(error);

        console.error('Error creating log:', error);
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await Log.findAll();
        return res.status(200).json({
            success: true,
            message: 'Logs retrieved successfully',
            data: logs
        });
    }
    catch (error) {
        console.log("err", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch Logs', error: error.message });

    }
}

const searchLogs = async (req, res) => {
    try {
        const { event_id, status, account_id } = req.body;

        if (!event_id && !status && !account_id) {
            return res.status(400).json({ success: false, message: 'At least one search parameter is required.' });
        }
        const cacheKey = `search_accounts_${JSON.stringify(req.body)}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log('Serving from cache');
            return res.status(200).json({
                success: true,
                source: 'cache',
                data: JSON.parse(cachedData)
            });
        }
        console.log('Serving from database');
        const whereClause = {};
        if (event_id) whereClause.event_id = { [Op.like]: `%${event_id}%` };
        if (status) whereClause.status = { [Op.like]: `%${status}%` };
        if (account_id) whereClause.AccountId = account_id;

        const logs = await Log.findAll({
            where: whereClause,
            include: [{ model: Account, as: "Account" }] // Avoid N+1
        });
        if (logs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Logs not found'
            });
        }
        await redis.set(cacheKey, JSON.stringify(logs), 'EX', 300);

        return res.status(200).json({
            success: true,
            source: 'database',
            data: logs
        });
        // return res.status(200).json({ success: true, data: logs });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
module.exports = { createLog, createLogApi, getLogs, searchLogs };
