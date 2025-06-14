const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./Role');
const AccountMember = sequelize.define('AccountMember', {
    account_id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'accountmembers',
    underscored: true,
    timestamps: false

});

module.exports = AccountMember;
