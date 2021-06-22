const passport = require('passport');

exports.authUser = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  badRequestMessage: 'Both fields are required'
});

// Checks if user is authenticated or not
exports.isAuthenticatedUser = (req, res, next) => {
  if(req.isAuthenticated()) return next()

  return res.redirect('/login')
}

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}
