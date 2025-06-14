const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Destination = sequelize.define('Destination', {
    url: { type: DataTypes.STRING, allowNull: false },
    http_method: { type: DataTypes.STRING, allowNull: false },
    headers: { type: DataTypes.JSON, allowNull: false },
    AccountId: {
        type: DataTypes.STRING,
        allowNull: false,

    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Destination;
