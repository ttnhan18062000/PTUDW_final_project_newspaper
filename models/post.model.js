const db = require("../utils/db");

module.exports = {
  async all() {
    const rs = await db.raw(`Call GTT_PostInfo();`);
    return rs[0][0];
  },
  async findById(id) {
    const rs = await db.raw(`Call GTR_PostDetail_By_ID();`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },
  // async findByName(name) {
  //   const rs = await db.raw(`Call GTR_Category_By_Name('${name}');`);
  //   return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  // },
  // async add(cat) {
  //   cat.parent = cat.parent === "" ? null : cat.parent;
  //   const query = `Call INS_Category(${cat.parent}, '${cat.name}')`;
  //   const rs = await db.raw(query);
  // },
  // async patch(cat) {
  //   cat.parent = cat.parent || 'null';
  //   const query = `Call UPD_Category(${cat.id}, ${cat.parent}, '${cat.name}')`;
  //   const rs = await db.raw(query);
  // },
  // async del(id) {
  //   const query = `Call DEL_Category(${id})`;
  //   const rs = await db.raw(query);
  // },
};