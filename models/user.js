const Sequelize = require('sequelize');
const { sequelize } = require('../config/connections.js');

const User = sequelize.define('user', {
    userId:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    userEmail: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    otp: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // verified: {
    //     type: Sequelize.BOOLEAN,
    //     defaultValue: false,
    //     allowNull: true
    // }
});

module.exports = { User }