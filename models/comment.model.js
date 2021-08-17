const db = require("../utils/db")
const { ENDPOINTS } = require('../configs/account.cfg');

module.exports = {
    async getCommentByPost(postID) {
        const rs = await db.raw(`Call GTT_Comment_By_PostID(${postID});`);
        return rs[0][0].length !== 0 ? rs[0][0] : null;
    },
    
    async insComment(PostID, AccountID, DateTime, Content){
        await db.raw(`Call INS_Comment(${PostID}, ${AccountID}, '${DateTime}', '${Content}');`);
    }
};
