const { Sequelize } = require('sequelize');

const db = new Sequelize('uptasknode', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

module.exports = db;
