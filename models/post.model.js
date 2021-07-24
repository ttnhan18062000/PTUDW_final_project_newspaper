const { ENDPOINTS } = require("../configs/post.cfg");
const db = require("../utils/db");
const { updateWriter } = require("./account.model");
const { patch } = require("./category.model");


module.exports = {
  async findByID(id) {
    const rs = await db.raw(ENDPOINTS.findByID(id));
    return rs[0][0][0] || null;
  },

  async all() {
    const rs = await db.raw(ENDPOINTS.all);
    return rs[0][0] || [];
  },

  async getPostTags(id) {
    const rs = await db.raw(ENDPOINTS.getPostTags(id));
    return rs[0][0] || [];
  },

  deleteTag(postID, tagID) {
    return db.raw(ENDPOINTS.deleteTag(postID, tagID));
  },

  insertTag(postID, tagID) {
    return db.raw(ENDPOINTS.insertTag(postID, tagID));
  },

  patch(post) {
    return db.raw(ENDPOINTS.update(post))
  },

  publish(postID, publishDate) {
    return db.raw(ENDPOINTS.publish(postID, publishDate));
  },

  async create(post) {
    const rs = await db.raw(ENDPOINTS.create(post));
    return rs[0][0][0] || null;
  },

  delete(id) {
    return db.raw(ENDPOINTS.delete(id));
  },

  updatePublishDate(postID, publishDate){
    return db.raw(ENDPOINTS.updatePublishDate(postID, publishDate));
  },
  
  async findById(id) {
    const rs = await db.raw(`Call GTR_PostDetail_By_ID(${id});`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },

  async find5PostRelatedById(id) {
    const rs = await db.raw(`Call GTT_PostInfo_Publish_Same_Category_By_PostID(${id});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async findPostByCategoryAndPage(categoryID, pageId) {
    const rs = await db.raw(`Call GTT_PostInfo_Publish_Pagging_By_CategoryID(${categoryID}, ${pageId});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getTop5ViewCountByCategoryId(categoryID) {
    const rs = await db.raw(`Call GTT_Top5_PostInfo_Publish_By_CategoryID(${categoryID});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getNumPageByCategoryID(categoryID) {
    const rs = await db.raw(`Call GTR_NumPage_PostInfo_Publish_By_CategoryID(${categoryID});`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },

  async findPostByTagAndPage(tagID, pageId) {
    const rs = await db.raw(`Call GTT_PostInfo_Publish_Pagging_By_TagID(${tagID}, ${pageId});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getTop5ViewCountByTagId(tagID) {
    const rs = await db.raw(`Call GTT_Top5_PostInfo_Publish_By_TagID(${tagID});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getNumPageByTagID(tagID) {
    const rs = await db.raw(`Call GTR_NumPage_PostInfo_Publish_By_TagID(${tagID});`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },

  async findPostByInputStringAndPage(inputString, pageId) {
    const rs = await db.raw(`Call GTT_Search_PostInfo('${inputString}', ${pageId});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getNumPageByInputString(inputString) {
    const rs = await db.raw(`Call GTT_Search_PostInfo_NumPage('${inputString}');`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  }, 

  async getNumPostByInputString(inputString) {
    const rs = await db.raw(`Call GTR_Search_PostInfo_Total('${inputString}');`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },

  async getPostByWriterID(id){
    const endpoint = ENDPOINTS.getPostByWriterID(id);
    const rs = await db.raw(endpoint);
    return rs[0][0] || [];
  }
}