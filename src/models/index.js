const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('data_pusher', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = require('./User')(sequelize, DataTypes);
const Account = require('./Account');
const Destination = require('./Destination');
const Role = require('./Role');
const AccountMember = require('./Accountmember');
const Log = require('./Logs');
sequelize.sync();
const db = {
    sequelize,
    Sequelize,
    User,
    Account,
    Destination,
    Role,
    AccountMember,
    Log
};

Account.hasMany(Destination, {
    foreignKey: 'AccountId',
    sourceKey: 'account_id',
    as: 'destinations',
    onDelete: 'CASCADE'
});

Destination.belongsTo(Account, {
    foreignKey: 'AccountId',
    targetKey: 'account_id',
    as: 'account',
    onDelete: 'CASCADE'
});

AccountMember.belongsTo(Account, { foreignKey: 'account_id', targetKey: 'account_id' });

Account.belongsToMany(User, {
    through: AccountMember,
    foreignKey: 'account_id',
    otherKey: 'user_id',
    onDelete: 'CASCADE'
});

User.belongsToMany(Account, {
    through: AccountMember,
    foreignKey: 'user_id',
    otherKey: 'account_id',
    onDelete: 'CASCADE'
});

Role.hasMany(AccountMember, { onDelete: 'CASCADE' });
AccountMember.belongsTo(Role, { onDelete: 'CASCADE' });

Account.hasMany(Log, { onDelete: 'CASCADE' });
Log.belongsTo(Account, { onDelete: 'CASCADE' });

Destination.hasMany(Log, { onDelete: 'CASCADE' });
Log.belongsTo(Destination, { onDelete: 'CASCADE' });
AccountMember.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(AccountMember, { foreignKey: 'role_id', as: 'accountMembers' });
Account.hasMany(Log, {
    foreignKey: 'AccountId',
    sourceKey: 'account_id',
    onDelete: 'CASCADE'
});

Log.belongsTo(Account, {
    foreignKey: 'AccountId',
    targetKey: 'account_id',
    onDelete: 'CASCADE'
});
Log.belongsTo(Account);
Log.belongsTo(Destination);

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Database Sync Error: ', error);
    }
};

syncDatabase();

module.exports = db;
