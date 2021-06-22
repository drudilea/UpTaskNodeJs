const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = require('../models/Users');

// Local Strategy - Login with own credentials
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({
          where: { email, active: 1 },
        });

        // User found, wrong password
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: 'Wrong password',
          });
        }

        // Email exists and valid password
        return done(null, user);
      } catch (error) {
        // User not found
        return done(null, false, {
          message: 'Email not found',
        });
      }
    }
  )
);

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
});

module.exports = passport;
