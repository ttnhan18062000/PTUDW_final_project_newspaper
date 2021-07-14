const exphbs = require('express-handlebars');
const moment = require('moment');
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
        const result = Array.isArray(selectedID)? selectedID.includes(id) : selectedID === id;
        return result ? 'selected' : '';
      },
      isNotAdmin(type, options){
        if (type !== 'Adminstrator')
          return options.fn(this);
        else 
          return options.inverse(this);
      },
      isNotPublish(status, options){
        if(status !== 'Publish')
          return options.fn(this);
        else
          return options.inverse(this);
      },
      isUnPublish(status, options){
        if(status === 'Unpublish')
          return options.fn(this);
        else
          return options.inverse(this);
      },
      formatTime(time){
        return moment(time, 'DD/MM/YYYY').format('DD/MM/YYYY')
      }
    }
  }));
  app.set('view engine', 'hbs');
}