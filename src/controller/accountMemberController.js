const Accountmember = require('../models/Accountmember');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const Account = require('../models/Account');
const User = require('../models/User');
const Role = require('../models/Role');

const addMember = async (req, res) => {
    try {
        const { account_id, user_id, role_id } = req.body;
        console.log('Incoming account_id:', account_id);

        const account = await Account.findOne({ where: { account_id } });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        const accountMember = await Accountmember.create({
            account_id,
            user_id,
            role_id
        });
        console.log(accountMember);

        return res.status(200).json({
            success: true,
            message: 'Member added successfully',
        });
    } catch (error) {
        console.error('Error adding member:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getMembers = async (req, res) => {
    try {
        const { account_id } = req.params;
        console.log('Fetching members for account_id:', account_id);

        const members = await Accountmember.findAll({
            where: { account_id },
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'role_name', 'created_at', 'updated_at']
            }]
        });

        return res.status(200).json({
            success: true,
            message: 'Members retrieved successfully',
            data: members
        });
    } catch (error) {
        console.error('Error fetching members:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};


module.exports = {
    addMember,
    getMembers
}