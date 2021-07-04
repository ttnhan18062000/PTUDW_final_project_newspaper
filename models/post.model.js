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

    async findPostByCategoryAndPage(categoryID, pageId){
        const rs = await db.raw(`Call GTT_PostInfo_Publish_Pagging_By_CategoryID(${categoryID}, ${pageId});`);
        return rs[0][0].length !== 0 ? rs[0][0] : null;
    },

    async getTop5ViewCountByCategoryId(categoryID){
        const rs = await db.raw(`Call GTT_Top5_PostInfo_Publish_By_CategoryID(${categoryID});`);
        return rs[0][0].length !== 0 ? rs[0][0] : null;
    },

    async getNumPageByCategoryID(categoryID){
        const rs = await db.raw(`Call GTR_NumPage_PostInfo_Publish_By_CategoryID(${categoryID});`);
        return rs[0][0].length !== 0 ? rs[0][0][0] : null;
    }
}