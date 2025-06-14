const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const crypto = require('crypto');
const Account = sequelize.define('Account', {
    account_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true

    },
    account_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true
    },
    app_secret_token: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => crypto.randomBytes(16).toString('hex')

    }
}, {
    timestamps: true,
    tableName: 'accounts',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: (account, options) => {
            account.app_secret_token = crypto.randomBytes(16).toString('hex');
        }
    }
});



module.exports = Account;
