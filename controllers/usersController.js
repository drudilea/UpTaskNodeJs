const Users = require('../models/Users');

exports.createUserForm = (req, res) => {
  res.render('new-user', {
    pageTitle: 'Create New User',
  });
};

exports.loginForm = (req, res) => {
  console.log(res.locals.messages )
  res.render('login', {
    pageTitle: 'Login',
  });
};

exports.createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    await Users.create({
      email,
      password,
    });
    res.redirect('/login');
  } catch (err) {
    req.flash(
      'error',
      err.errors.map((error) => error.message)
    );
    res.render('new-user', {
      pageTitle: 'Create New User',
      messages: req.flash(),
      email,
      password,
    });
  }
};
