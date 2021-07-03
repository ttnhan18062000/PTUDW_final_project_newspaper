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
        return id === selectedID ? 'selected' : '';
      },
      isNotAdmin(type, options){
        if (type !== 'Adminstrator')
          return options.fn(this);
        else 
          return options.inverse(this);
      }
    }
  }));
  app.set('view engine', 'hbs');
}