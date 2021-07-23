const db = require("../utils/db");
const {ENDPOINTS} = require('../configs/tag.cfg');

module.exports = {
  async getAllTagRelatedPost(postId){
    const rs = await db.raw(`Call GTT_PostTag_By_PostID(${postId});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },
  async all() {
    const rs = await db.raw(ENDPOINTS.all);
    return rs[0][0] || [];
  },
  async findByID(id) {
    const rs = await db.raw(ENDPOINTS.findByID(id));
    return rs[0][0][0] || null;
  },
  async findByName(name) {
    const rs = await db.raw(ENDPOINTS.findByName(name));
    return  rs[0][0][0] || null;
  },
  add(name) {
    return db.raw(ENDPOINTS.add(name));
  },
  patch(item) {
    return db.raw(ENDPOINTS.update(item));
  },
  delete(id) {
    return db.raw(ENDPOINTS.delete(id));
  },
    
};