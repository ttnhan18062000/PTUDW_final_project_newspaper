const { ENDPOINTS } = require("../configs/post.cfg");
const db = require("../utils/db");
const { updateWriter } = require("./account.model");
const { patch } = require("./category.model");


module.exports = {
  async findByID(id) {
    const rs = await db.raw(ENDPOINTS.findByID(id));
    return rs[0][0][0] || null;
  },

  async find5PostRelatedById(id) {
    const rs = await db.raw(`Call GTT_PostInfo_Publish_Same_Category_By_PostID(${id});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async all() {
    const rs = await db.raw(ENDPOINTS.all);
    return rs[0][0] || [];
  },

  async getPostTags(id){
    const rs = await db.raw(ENDPOINTS.getPostTags(id));
    return rs[0][0] || [];
  },

  deleteTag(postID, tagID){
    return db.raw(ENDPOINTS.deleteTag(postID, tagID)); 
  },
  
  insertTag(postID, tagID){
    return db.raw(ENDPOINTS.insertTag(postID, tagID)); 
  },

  patch(post){
    return db.raw(ENDPOINTS.update(post))
  }
}