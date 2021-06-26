const db = require('../utils/db');

module.exports = {
    async all() {
        const res = await db.raw("Call GTT_Category()");
        return res[0][0];
    }

};