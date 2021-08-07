const session = require('express-session');

module.exports = function (app) {
  app.set('trust proxy', 1);
  app.use(session({
    secret: 'sol',
    resave: false,
    saveUninitialized: true,
  }))
}