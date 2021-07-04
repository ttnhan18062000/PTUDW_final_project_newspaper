const ENDPOINTS = {
  all: `Call GTT_PostDetail();`,
  findByID: (id) => `Call GTR_PostDetail_By_ID(${id});`,
  add: (name) => `Call INS_Tag('${name}');`,
  getPostTags: (id) => `Call GTT_PostTag_By_PostID(${id});`,
  update: (post) => 
              `Call UPD_Post('${post.postID}', '${post.writer}', '${post.category}', '${post.premium}', '${post.title}', '${post.abstract}', '${post.content}');`,
  delete: (id) => `Call DEL_Tag_By_ID(${id});`,
  insertTag: (postID, tagID) => `Call INS_PostTag('${postID}', '${tagID}')`,
  deleteTag: (postID, tagID) => `Call DEL_PostTag('${postID}', '${tagID}')`,

}
module.exports = {
  ENDPOINTS,
};