const { Sequelize } = require('sequelize');

// Get .env variables
require('dotenv').config({ path: 'variables.env' });

const db = new Sequelize(
  process.env.BD_NAME,
  process.env.BD_USER,
  process.env.BD_PASS,
  {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    define: {
      timestamps: false,
    },
    port: process.env.BD_PORT,
  }
);

module.exports = db;
