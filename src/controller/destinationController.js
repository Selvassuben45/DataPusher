const { get } = require('../app');
const Destination = require('../models/Destination');
const Account = require('../models/Account');
const { Op } = require('sequelize');
const redis = require('../config/redis');
const createDestination = async (req, res) => {
    try {
        const { url, http_method, headers, AccountId } = req.params;
        const createdBy = req.user ? req.user.email : 'Unknown';
        const role = req.user ? req.user.role : 'Unknown';
        console.log("cr", createdBy, role);

        console.log(`Destination creation requested by ${createdBy} with role ${role}`);
        const account = await Account.findOne({ where: { account_id: AccountId } });
        console.log("acc", AccountId, account);

        if (!account) {
            return res.status(400).json({
                success: false,
                message: `AccountId ${AccountId} does not exist`
            });
        }

        const destination = await Destination.create({
            url,
            http_method,
            headers,
            AccountId
        });

        return res.status(200).json({
            success: true,
            message: 'Destination created successfully',
            data: destination
        });
    } catch (error) {
        console.error('Error creating destination:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        return res.status(200).json({
            success: true,
            message: 'Destinations retrieved successfully',
            data: destinations
        });
    } catch (error) {
        console.error('Error fetching destinations:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findByPk(req.params.id);

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: 'Destination not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Destination retrieved successfully',
            data: destination
        });
    } catch (error) {
        console.error('Error fetching destination:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch destination',
            error: error.message
        });
    }
};

const updateDestination = async (req, res) => {
    try {
        const { id } = req.body;

        if (!req.body.AccountId) {
            return res.status(400).json({
                success: false,
                message: 'AccountId is required to update destination'
            });
        }

        const accountExists = await Account.findOne({
            where: { account_id: req.body.AccountId }
        });

        if (!accountExists) {
            return res.status(400).json({
                success: false,
                message: 'Provided AccountId does not exist'
            });
        }

        const { AccountId, updated_by, ...updateData } = req.body;

        const [updated] = await Destination.update(
            { ...updateData, updated_by },
            { where: { id } }
        );

        if (updated === 0) {
            return res.status(404).json({ success: false, message: 'Destination not found' });
        }

        const updatedDestination = await Destination.findByPk(id);

        res.json({
            success: true,
            message: 'Destination updated successfully',
            data: updatedDestination
        });
    } catch (err) {
        console.error('Error updating destination:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
const deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByPk(req.params.id);
        if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });

        await destination.destroy();
        return res.status(200).json({ success: true, message: 'Account deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to delete account', error: error.message });
    }
}

const searchDestinations = async (req, res) => {
    try {
        const { url, http_method, AccountId } = req.body;
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
        if (!url && !http_method && !AccountId) {
            return res.status(400).json({ success: false, message: 'At least one search parameter is required' });
        }

        const whereClause = {};
        if (url) whereClause.url = { [Op.like]: `%${url}%` };
        if (http_method) whereClause.http_method = { [Op.like]: `%${http_method}%` };
        if (AccountId) whereClause.AccountId = AccountId;

        const destinations = await Destination.findAll({
            where: whereClause,
            include: [{ model: Account , as :"account" }]
        });
  if (destinations.length === 0) {
            return res.status(404).json({ success: false, message: 'Destination not found' });
        }
         await redis.set(cacheKey, JSON.stringify(destinations), 'EX', 300);

                return res.status(200).json({
                    success: true,
                    source: 'database',
                    data: destinations
                });
        // return res.status(200).json({ success: true, data: destinations });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
module.exports = {
    createDestination, getAllDestinations, getDestinationById, updateDestination, deleteDestination,searchDestinations
}