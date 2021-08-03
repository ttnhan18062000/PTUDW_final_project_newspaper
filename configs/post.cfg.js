const ENDPOINTS = {
  all: `Call GTT_PostDetail();`,
  findByID: (id) => `Call GTR_PostDetail_By_ID(${id});`,
  getPostTags: (id) => `Call GTT_PostTag_By_PostID(${id});`,
  update: (post) =>
    `Call UPD_Post('${post.postID}', '${post.writer}', '${post.category}', '${post.premium}', 
              '${post.title}', '${post.abstract}', '${post.content}');`,
  delete: (id) => `Call DEL_Cascade_Post(${id});`,
  createByAdmin: (post) => `Call INS_PostDetail('${post.writer}', '${post.category}', '${post.premium}', 
                                '${post.status}', '${post.publishDate}', '${post.title}', '${post.abstract}', '${post.content}');`,
  insertTag: (postID, tagID) => `Call INS_PostTag('${postID}', '${tagID}')`,
  deleteTag: (postID, tagID) => `Call DEL_PostTag('${postID}', '${tagID}')`,
  publish: (postID, publishDate) => `Call UPD_Post_Publish('${postID}', '${publishDate}')`,
  updatePublishDate: (postID, publishDate) => `Call UPD_Post_PublishDate('${postID}', '${publishDate}')`,
  getPostByWriterID: (id) => `Call GTT_PostDetail_By_Writer(${id})`,
  createByWriter: (post) => `Call INS_PostDetail('${post.writer}', '${post.category}', '${post.premium}', 
                                'Draft', NULL, '${post.title}', '${post.abstract}', '${post.content}');`,
  getDraftPostByCatID: (id) => `Call GTT_Draft_Post_By_Category(${id});`,
  publishPostByEditor: (postID, publishDate, catID) => `Call UPD_Publish_Post_Editor(${postID}, '${publishDate}', ${catID});`,
  refusePostByEditor: (accountID, postID, date, note) => `Call INS_PostReport(${accountID}, ${postID}, '${date}', '${note}');`,
}
module.exports = {
  ENDPOINTS,
};