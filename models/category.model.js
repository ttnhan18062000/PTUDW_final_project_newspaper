const { ENDPOINTS } = require("../configs/category.cfg");
const db = require("../utils/db");

module.exports = {
  async all() {
    const rs = await db.raw(`Call GTT_Category();`);
    return rs[0][0] || [];
  },
  async findById(id) {
    const rs = await db.raw(`Call GTR_Category_By_ID(${id});`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },
  async findByName(name) {
    const rs = await db.raw(`Call GTR_Category_By_Name('${name}');`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },
  async add(cat) {
    cat.parent = cat.parent === "" ? null : cat.parent;
    const query = `Call INS_Category(${cat.parent}, '${cat.name}')`;
    const rs = await db.raw(query);
  },
  async patch(cat) {
    cat.parent = cat.parent || 'null';
    const query = `Call UPD_Category(${cat.id}, ${cat.parent}, '${cat.name}')`;
    const rs = await db.raw(query);
  },
  async del(id) {
    const query = `Call DEL_Category(${id})`;
    const rs = await db.raw(query);
  },
  async getEditorCategories(id){
    const endpoint = ENDPOINTS.getEditorCategories(id);
    const rs = await db.raw(endpoint);
    return rs[0][0] || [];
  }
};