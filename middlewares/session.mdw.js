const session = require('express-session');

module.exports = function (app) {
  app.set('trust proxy', 1);
  app.use(session({
    secret: 'wBh7x5P3ETm72JxYzRWn',
    resave: false,
    saveUninitialized: true,
  }))
}