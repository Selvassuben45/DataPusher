const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const AccountMember = require('./Accountmember');
const Role = sequelize.define('Role', {
    role_name: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Role;
