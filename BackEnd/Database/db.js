const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");
if (process.env.NODE_ENV !== 'production') {
  await sequelize.sync({ alter: true });
}
  } catch (error) {
    console.error(" DB connection failed:", error.message);
  }
};

module.exports = { sequelize, connection };
