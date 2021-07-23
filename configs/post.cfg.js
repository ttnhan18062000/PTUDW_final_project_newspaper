const ENDPOINTS = {
  all: `Call GTT_PostDetail();`,
  findByID: (id) => `Call GTR_PostDetail_By_ID(${id});`,
  add: (name) => `Call INS_Tag('${name}');`,
  getPostTags: (id) => `Call GTT_PostTag_By_PostID(${id});`,
  update: (post) => 
              `Call UPD_Post('${post.postID}', '${post.writer}', '${post.category}', '${post.premium}', '${post.title}', '${post.abstract}', '${post.content}');`,
  delete: (id) => `Call DEL_Cascade_Post(${id});`,
  create: (post) => `Call INS_PostDetail('${post.writer}', '${post.category}', '${post.premium}', '${post.status}', '${post.publishDate}', '${post.title}', '${post.abstract}', '${post.content}');`,
  insertTag: (postID, tagID) => `Call INS_PostTag('${postID}', '${tagID}')`,
  deleteTag: (postID, tagID) => `Call DEL_PostTag('${postID}', '${tagID}')`,
  publish: (postID, publishDate) => `Call UPD_Post_Publish('${postID}', '${publishDate}')`,
  updatePublishDate: (postID, publishDate) => `Call UPD_Post_PublishDate('${postID}', '${publishDate}')`,
}
module.exports = {
  ENDPOINTS,
};