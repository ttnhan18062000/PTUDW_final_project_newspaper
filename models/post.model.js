const db = require("../utils/db")


module.exports = {
    async findById(id) {
        const rs = await db.raw(`Call GTR_PostDetail_By_ID(${id});`);
        return rs[0][0].length !== 0 ? rs[0][0][0] : null;
    },

    async find5PostRelatedById(id) {
        const rs = await db.raw(`Call GTT_PostInfo_Publish_Same_Category_By_PostID(${id});`);
        return rs[0][0].length !== 0 ? rs[0][0] : null;
    },
}