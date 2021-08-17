const { ENDPOINTS } = require("../configs/post.cfg");
const db = require("../utils/db");


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

  async createByAdmin(post) {
    const rs = await db.raw(ENDPOINTS.createByAdmin(post));
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

  async findPostByInputStringAndPageTitle(inputString, pageId) {
    const rs = await db.raw(`Call GTT_Search_PostInfo_Title('${inputString}', ${pageId});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getNumPageByInputStringTitle(inputString) {
    const rs = await db.raw(`Call GTT_Search_PostInfo_Numpage_Title('${inputString}');`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  }, 

  async getNumPostByInputStringTitle(inputString) {
    const rs = await db.raw(`Call GTR_Search_PostInfo_Total_Title('${inputString}');`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },

  async findPostByInputStringAndPageAbstract(inputString, pageId) {
    const rs = await db.raw(`Call GTT_Search_PostInfo_Title('${inputString}', ${pageId});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getNumPageByInputStringAbstract(inputString) {
    const rs = await db.raw(`Call GTT_Search_PostInfo_Numpage_Title('${inputString}');`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  }, 

  async getNumPostByInputStringAbstract(inputString) {
    const rs = await db.raw(`Call GTR_Search_PostInfo_Total_Title('${inputString}');`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },

  async findPostByInputStringAndPageContent(inputString, pageId) {
    const rs = await db.raw(`Call GTT_Search_PostInfo_Content('${inputString}', ${pageId});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getNumPageByInputStringContent(inputString) {
    const rs = await db.raw(`Call GTT_Search_PostInfo_Numpage_Content('${inputString}');`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  }, 

  async getNumPostByInputStringContent(inputString) {
    const rs = await db.raw(`Call GTR_Search_PostInfo_Total_Content('${inputString}');`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },

  async getTop4Post(){
    const rs = await db.raw(`Call GTT_TopWeek_PostInfo_By_ViewCount();`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getTop10PostByDate() {
    const rs = await db.raw(`Call GTT_Top10_PostInfo_By_Date();`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getTop10PostByViewCount() {
    const rs = await db.raw(`Call GTT_Top10_PostInfo_By_ViewCount();`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getTop10PostPerCategory(){
    const rs = await db.raw(`Call GTT_Top10_PostInfo_PerCat();`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getTopLatestPost10Category(){
    const rs = await db.raw(`Call GTT_Top10_Cat_PostInfo_With_LastestPost();`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getPostByWriterID(id){
    const endpoint = ENDPOINTS.getPostByWriterID(id);
    const rs = await db.raw(endpoint);
    return rs[0][0] || [];
  },

  async createByWriter(post) {
    const rs = await db.raw(ENDPOINTS.createByWriter(post));
    return rs[0][0][0] || null;
  },
  async getDraftPostByCatID(id){
    const rs = await db.raw(ENDPOINTS.getDraftPostByCatID(id));
    return rs[0][0] || [];
  },

  publishPostByEditor(postID, publishDate, catID){
    return db.raw(ENDPOINTS.publishPostByEditor(postID, publishDate, catID));
  },

  refusePostByEditor(accID, postID, date, note){
    return db.raw(ENDPOINTS.refusePostByEditor(accID, postID, date, note));
  },

  async getTop10PostACateByViewPoint(categoryID){
    const rs = await db.raw(`Call GTT_Top10_Post_By_Cate(${categoryID});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getRefusedPost(postID){
    const rs = await db.raw(ENDPOINTS.getRefusedPost(postID));
    return rs[0][0][0] || null;
  },

  updateRefusedToDraft(postID){
    return db.raw(ENDPOINTS.updateRefusedToDraft(postID));
  },
  async increaseViewCountBy1(PostID){
    await db.raw(`Call UPD_Post_ViewCount(${PostID});`);
  },

  async getTotalPostByCategory(categoryID){
    const rs = await db.raw(`Call GTR_Total_PostInfo_Publish_By_CategoryID(${categoryID});`);
    return rs[0][0].length !== 0 ? rs[0][0] : null;
  },

  async getTotalPostByTag(tagID){
    const rs = await db.raw(`Call GTR_Total_PostInfo_Publish_By_TagID(${tagID});`);
    return rs[0][0].length !== 0 ? rs[0][0][0] : null;
  },
}