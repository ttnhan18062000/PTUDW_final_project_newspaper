const db = require("../utils/db");

module.exports = {
    async getAllTagRelatedPost(postId){
        const rs = await db.raw(`Call GTT_PostTag_By_PostID(${postId});`);
        return rs[0][0].length !== 0 ? rs[0][0] : null;
    }
}