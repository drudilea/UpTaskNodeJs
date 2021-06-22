const Users = require('../models/Users');
const sendEmail = require('../handlers/email');

exports.createUserForm = (req, res) => {
  res.render('new-user', {
    pageTitle: 'Create New User',
  });
};

exports.loginForm = (req, res) => {
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

    const confirmUrl = `http://${req.headers.host}/confirm/${email}`;

    const user = { email };

    // Send email to confirm
    await sendEmail.send({
      user,
      subject: 'Confirm your UpTask account',
      confirmUrl,
      file: 'confirm-account',
    });

    req.flash('correcto', 'You can check your inbox to confirm your account');
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

exports.recoverPasswordForm = (req, res) => {
  res.render('recover', {
    pageTitle: 'Recover Password',
  });
};

exports.confirmAccount = async (req, res) => {
  const user = await Users.findOne({ where: { email: req.params.email } });

  if (!user) {
    req.flash('error', 'Invalid');
    res.redirect('/new-user');
  }

  user.active = 1;
  await user.save();

  req.flash('correcto', 'Account verified');
  res.redirect('/login');
};
