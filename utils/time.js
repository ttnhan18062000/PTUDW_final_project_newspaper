const moment = require('moment');
const formatTime = (time) => moment(time).format('DD/MM/YYYY');
module.exports = {
  formatTime
}