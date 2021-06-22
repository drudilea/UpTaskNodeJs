const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const Projects = require('./Projects');

const Users = db.define(
  'users',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email is not valid',
        },
        notEmpty: {
          msg: 'Email is required',
        },
      },
      unique: {
        args: true,
        msg: 'Email already registered',
      },
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required',
        },
      },
    },
  },
  {
    hooks: {
      beforeCreate(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      },
    },
  }
);


// Custom methods
Users.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

// Users.hasMany(Projects);

module.exports = Users;
