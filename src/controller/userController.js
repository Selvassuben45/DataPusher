// src/controller/userController.js
const { User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const inviteUser = async (req, res) => {
    try {
        const { email, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const tempPassword = Math.random().toString(36).slice(-8);
        console.log(`Temporary password for ${email}: ${tempPassword}`);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            role
        });

        console.log(`Temporary password for ${email}: ${tempPassword}`);

        return res.status(200).json({
            success: true,
            message: 'User invited successfully',
            data: {
                email: newUser.email,
                role: newUser.role,
                invite_token: newUser.invite_token || uuidv4() // Generate a token if not already set
            }
        });

    } catch (error) {
        console.error('Error inviting user:', error);
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const acceptInvite = async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await User.findOne({ where: { invite_token: token, status: 'invited' } });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.status = 'active';
        user.invite_token = null;

        await user.save();

        return res.status(200).json({ success: true, message: 'Account activated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { inviteUser, acceptInvite };
