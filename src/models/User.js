module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false || true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'users',
        underscored: true
    });
    return User;
};
