const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');

module.exports = function(app) {
  app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers: {
      section: hbs_sections(),
      jsonParse(str) {
        return JSON.stringify(str);
      },
      getSelectedAttr(id, selectedID) {
        console.log(id, selectedID)
        return id === selectedID ? 'selected' : '';
      }
    }
  }));
  app.set('view engine', 'hbs');
}