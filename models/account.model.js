const db = require("../utils/db")
const {ENDPOINTS} = require('../configs/account.cfg');

module.exports = {
  all() {
    return db.raw(`Call GTA_Account();`);
  },

  add(account) {
    return db.raw(`Call INS_Account_Subscriber('${account.Email}', '${account.Password}', '${account.Otp}');`)
  },

  async findByEmail(email) {
    const res = await db.raw(`Call GTR_Account_By_Email('${email}');`);
    return res[0][0][0] || null;
  },

  async findByID(id) {
    const nId = parseInt(id);
    const account = await db('Account').where({ ID: id });
    if (account.length === 0)
      return null;
    return account[0];
  },

  async findExternalByID(id, domain){
    const eAccount = await db('AccountLink').where({ExternalID: id, DomainName: domain});
    if (eAccount.length === 0)
      return null;
    return eAccount[0];
  },

  async insertExternalLink(accountID, externalID, domainName){
    const res = await db.raw(`Call INS_External_AccountLink_Subscriber('${accountID}', '${externalID}', '${domainName}');`)
    return res[0][0][0] || null;
  },

  async insertExternalAccount(email, externalID, domainName){
    const res = await db.raw(`Call INS_External_Account_Subscriber('${email}', '${externalID}', '${domainName}');`)
    return res[0][0][0] || null;
  },

  async updatePasswordByEmail(email, password) {
    const res = await db.raw(`Call UPD_Account_Password_By_Email('${email}', '${password}');`);
    if (res[0].length === 0 || res[0][0].result === 0)
      return false;
    return true;
  },

  async updateOtpByEmail(email, Otp) {
    const res = await db.raw(`Call UDP_Otp_Account_Subscriber('${email}', '${Otp}');`)
  },

  async updateStatusActiveByEmail(email) {
    const res = await db.raw(`Call UDP_Status_Active_Account_Subscriber('${email}');`);
  },

  async findDetailByID(id) {
    const nId = parseInt(id);
    const account = await db.raw(`Call GTR_Detail_Account_By_ID(${nId})`);
    return account[0][0][0] || null;
  },

  async insertOrUpdateByID(id, dname, fname, lname, email, dob) {
    const nId = parseInt(id);
    const result = await db.raw(`Call UPD_INS_AccountDetail_By_ID(${nId},'${dname}',  '${fname}', '${lname}', '${dob}', '${email}');`);
  },

  async detailAll() {
    const rs = await db.raw(`Call GTT_Detail_Account();`);
    return rs[0][0];
  },

  async delCatOfEditor(catID, editorID) {
    const cID = +catID;
    const eID = +editorID;
    return await db.raw(`Call DEL_Detail_Editor_Account(${eID}, ${cID});`);
  },

  async insCatOfEditor(catID, editorID) {
    const cID = +catID;
    const eID = +editorID;
    return await db.raw(`Call INS_Detail_Editor_Account(${eID}, ${cID});`);
  },

  async updateWriter(writerID, alias) {
    const id = +writerID;
    return await db.raw(`Call UPD_INS_Detail_Writer_Account(${id}, '${alias}');`);
  },

  async allWriters() {
    const rs = await db.raw(`Call GTT_Detail_Account_Writer();`);
    return rs[0][0];
  },

  async detailWriter(id) {
    const nId = parseInt(id);
    const rs = await db.raw(`Call GTR_Detail_Writer_Account_By_AccountID(${nId});`);
    return rs[0][0][0] || null;
  },

  async detailEditor(id) {
    const nId = parseInt(id);
    const rs = await db.raw(`Call GTR_Detail_Editor_Account_By_AccountID(${nId});`);
    return rs[0][0] || null;
  },

  async detail(account){
    switch(account.AccountType){
      case "Writer":{
        const endpoint = ENDPOINTS.detail.Writer(account.ID);
        const rs = await db.raw(endpoint);
        return rs[0][0][0] || {};
      }
      case "Editor":{
        const endpoint = ENDPOINTS.detail.Editor(account.ID);
        const rs = await db.raw(endpoint);
        return rs[0][0] || {};
      }
      default:{
      }
    }
  },

  async addByAdmin(account) {
    const endpoint = ENDPOINTS.addByAdmin[account.type](account);
    return db.raw(endpoint);
  },

  async delete(account) {
    const endpoint = ENDPOINTS.delete[account.AccountType](account.ID);
    return db.raw(endpoint);
  },

  async getPremiumRequests() {
    const rs = await db.raw(ENDPOINTS.getPremiumRequests);
    return rs[0][0] || [];
  },

  acceptPremium(accID, expriredDate){
    return db.raw(ENDPOINTS.acceptPremium(accID, expriredDate));
  }


};