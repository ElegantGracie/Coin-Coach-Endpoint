const Sequelize = require('sequelize')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER, process.env.PASSWORD, {
        dialect: 'mysql', host: process.env.HOST
})

module.exports = {sequelize}
