const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    dialect: "mysql",
    host: process.env.HOST,
  }
);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
  sequelize.sync()
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = { sequelize };
