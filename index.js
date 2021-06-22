const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'variables.env' });

const passport = require('./config/passport');
const routes = require('./routes');
const helpers = require('./helpers');

// Connect to database
const db = require('./config/db');
// Import model
require('./models/Projects');
require('./models/Tasks');
require('./models/Users');
// Sync all defined models to database
db.sync()
  .then(() => console.log('Database connected'))
  .catch((error) => console.log('Database connection error', error));

// Create express app
const app = express();

// Location of static files
app.use(express.static('public'));

// Enable Pug as view engine
app.set('view engine', 'pug');
// Add Views folder
app.set('views', path.join(__dirname, './views'));

// Enable bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add Flash messages
app.use(flash());

app.use(cookieParser());

// Sessions to navigate without re-authenticate
app.use(
  session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Send vardump to app
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.messages = req.flash();
  res.locals.user = { ...req.user } || null;
  next();
});

app.use('/', routes());

// Server and port
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
  console.log('Server online!');
});

require('./handlers/email');
