const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Log = sequelize.define('Log', {
    event_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,

    },
    AccountId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DestinationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    received_timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    processed_timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    received_data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Log;
