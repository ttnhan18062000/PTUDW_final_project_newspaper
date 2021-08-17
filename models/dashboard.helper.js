const { ENDPOINTS } = require('../configs/dashboard')
const db = require('../utils/db')
module.exports = {
  getTotal : async () => {
    const rs = await Promise.all(Object.keys(ENDPOINTS).map(key => db.raw(ENDPOINTS[key])));
    return rs.map(i => {
      const obj = i[0][0][0];
      return obj[Object.keys(obj)[0]];
    });
  }
}