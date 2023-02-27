const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/connections");

const Profile = sequelize.define('profile', {
    profileId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    profileImg: {
        type: Sequelize.BLOB
    }
})

module.exports = {Profile}