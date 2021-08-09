const listType = ["Subscriber", "Writer", "Editor", "Adminstrator"];

const ENDPOINTS = {
  addByAdmin:{
    Adminstrator: (account) => `Call INS_Account_Admin_By_Admin('${account.email}', '${account.password}');`,
    Subscriber: (account) => `Call INS_Account_Subscriber_By_Admin('${account.email}', '${account.password}');`,
    Writer: (account) => `Call INS_Account_Writer_By_Admin('${account.email}', '${account.password}');`,
    Editor: (account) => `Call INS_Account_Editor_By_Admin('${account.email}', '${account.password}');`,
  },
  delete: {
    Editor: (id) => `Call DEL_Account_Editor(${id});`,
    Writer: (id) => `Call DEL_Account_Writer(${id});`,
    Subscriber: (id) => `Call DEL_Account_Subscriber(${id});`,
  },
  detail: {
    Editor: (id) => `Call GTT_CategoryManageDetail_By_AccountID(${id});`,
    Writer: (id) => `Call GTR_Detail_Writer_Account_By_AccountID(${id});`,
  }
}
module.exports = {
  listType, 
  ENDPOINTS,
};