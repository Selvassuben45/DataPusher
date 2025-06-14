// controller/accountController.js

const Account = require('../models/Account');
const { Op } = require('sequelize');
const redis = require('../config/redis');

const createAccount = async (req, res) => {
    try {
        const { account_id, account_name, website } = req.body;
        const account = await Account.create({ account_id, account_name, website });
        return res.status(200).json({
            success: true,
            message: 'Account created successfully',
            data: account
        });
    } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getAccount = async (req, res) => {
    try {
        const accounts = await Account.findAll();
        return res.status(200).json({
            success: true,
            message: 'Accounts retrieved successfully',
            data: accounts
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch accounts',
            error: error.message
        });
    }
};

const getAccountById = async (req, res) => {
    try {
        const account = await Account.findOne({ where: { id: req.params.id } });
        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Account retrieved successfully',
            data: account
        });
    } catch (error) {
        console.error('Error fetching account:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch account',
            error: error.message
        });
    }
};

const updateAccount = async (req, res) => {
    try {
        const { account_name, website } = req.body;
        const [updated] = await Account.update({ account_name, website }, { where: { id: req.params.id } });

        if (updated === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        const updatedAccount = await Account.findOne({ where: { id: req.params.id } });
        return res.status(200).json({
            success: true,
            message: 'Account updated successfully',
            data: updatedAccount
        });
    } catch (error) {
        console.error('Error updating account:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update account',
            error: error.message
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const account = await Account.findOne({ where: { id: req.params.id } });
        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        await account.destroy();
        return res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: error.message
        });
    }
};

// const searchAccounts = async (req, res) => {
//     try {
//         const { account_name } = req.body;
//    if (!account_name) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid Data: account_name is required'
//             });
//         }
//         // const cacheKey = `search_accounts_${JSON.stringify(req.body)}`;
//         // const cachedData = await redis.get(cacheKey);

//         // if (cachedData) {
//         //     console.log('Serving from cache');
//         //     return res.status(200).json({
//         //         success: true,
//         //         source: 'cache',
//         //         data: JSON.parse(cachedData)
//         //     });
//         // }

//         // console.log('Serving from database');
//         const accounts = await Account.findAndCountAll({
//             where: { account_name: { [Op.like]: `%${account_name}%` } }
//         });

//         if (accounts.count === 0) {
//             return res.status(404).json({ success: false, message: 'Account not found' });
//         }

//         // await redis.set(cacheKey, JSON.stringify(accounts), 'EX', 300);

//         // return res.status(200).json({
//         //     success: true,
//         //     source: 'database',
//         //     data: accounts
//                 return res.status(200).json({ success: true, data: accounts });

//         // });
//     } catch (error) {
//         console.error('Error searching accounts:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Server error',
//             error: error.message
//         });
//     }
// };
const searchAccounts = async (req, res) => {
    try {
        const { account_name } = req.body;
           if (!account_name) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Data: account_name is required'
            });
        }

        // const cacheKey = `search_accounts_${JSON.stringify(req.body)}`;
        // const cachedData = await redis.get(cacheKey);

        // if (cachedData) {
        //     console.log('Serving from cache');
        //     return res.status(200).json({
        //         success: true,
        //         source: 'cache',
        //         data: JSON.parse(cachedData)
        //     });
        // }

        // console.log('Serving from database');
        const accounts = await Account.findAndCountAll({
            where: { account_name: { [Op.like]: `%${account_name}%` } }
        });

        if (accounts.count === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        // await redis.set(cacheKey, JSON.stringify(accounts), 'EX', 300);

        // return res.status(200).json({
        //     success: true,
        //     source: 'database',
        //     data: accounts
                        return res.status(200).json({ success: true, data: accounts });

        // });
    } catch (error) {
        console.error('Error searching accounts:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
module.exports = {
    createAccount,
    getAccount,
    getAccountById,
    updateAccount,
    deleteAccount,
    searchAccounts
};
