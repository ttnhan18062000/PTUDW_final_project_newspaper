const exphbs = require('express-handlebars');
const hbsSections = require('express-handlebars-sections');

module.exports = function (app) {
  app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers: {
      section: hbsSections()
    }
  }));
  app.set('view engine', 'hbs');
}