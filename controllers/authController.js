const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const Users = require('../models/Users');
const sendEmail = require('../handlers/email');

exports.authUser = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  badRequestMessage: 'Both fields are required',
});

// Checks if user is authenticated or not
exports.isAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.redirect('/login');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

exports.generateToken = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ where: { email } });

  if (!user) {
    req.flash('error', 'Email not found');
    res.redirect('/recover');
  }

  user.token = crypto.randomBytes(20).toString('hex');
  user.expiration = Date.now() + 3600000;

  // Save in db
  await user.save();

  // Reset URL
  const resetUrl = `http://${req.headers.host}/recover/${user.token}`;

  // Send email with token
  await sendEmail.send({
    user,
    subject: 'Password Reset',
    resetUrl,
    file: 'reset-password',
  });

  req.flash('correcto', 'A recovery email has been sent to your inbox');
  res.redirect('/login');
};

exports.resetPasswordForm = async (req, res) => {
  const token = req.params.token;
  const user = await Users.findOne({ where: { token } });

  if (!user) {
    req.flash('error', 'Invalid');
    res.redirect('/recover');
  }

  res.render('reset-password', {
    pageTitle: 'Reset Password',
  });
};

exports.updatePassword = async (req, res) => {
  const token = req.params.token;
  // Validate token and expiration date
  const user = await Users.findOne({
    where: {
      token,
      expiration: {
        [Op.gte]: Date.now(),
      },
    },
  });

  if (!user) {
    req.flash('error', 'Invalid');
    res.redirect('/recover');
  }

  user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  user.token = null;
  user.expiration = null;

  // Save changes in dbv
  await user.save();

  req.flash('correcto', 'Your password has been modified successfully');
  res.redirect('/login');
};
