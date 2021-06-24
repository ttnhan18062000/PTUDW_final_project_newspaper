const db = require("../utils/db")


module.exports = {
    all() {
        return db.raw(`Call GTA_Account();`);
    },

    add(account){
        return db.raw(`Call INS_Account_Subscriber('${account.Email}', '${account.Password}')`)
    },

    async findByEmail(email){
        const account = await db('Account').where({Email: email});
        if (account.length === 0)
            return null;
        return account[0];
    },

    async findByID(id){
        const nId = parseInt(id);
        const account = await db('Account').where({ID: id});
        if (account.length === 0)
            return null;
        return account[0];
    },

    async updatePasswordByEmail(email, password){
        const res = await db.raw(`Call UPD_Account_Password_By_Email('${email}', '${password}');`);
        if (res[0].length === 0 || res[0][0].result === 0)
            return false;
        return true;
    }

};  