const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

app.use(express.urlencoded({
  extended: true
}));

app.use('/public', express.static('public'));

require('./middlewares/session.mdw')(app);
require('./middlewares/flash.mdw')(app);
require('./middlewares/passport.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/view.mdw')(app);
require('./middlewares/routes.mdw.js')(app);

//keep this for boostrap intelligense
app.get('/bs4', function(req, res){
  res.sendFile(__dirname+'/bs4.html')
})

const PORT = 5000;
app.listen(PORT, function() {
  console.log(`EC Web App listening at http://localhost:${PORT}`);
});