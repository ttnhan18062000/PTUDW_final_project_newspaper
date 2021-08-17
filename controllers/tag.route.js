const express = require('express');
const router = express.Router();

const tagModel = require('../models/tag.model');
const postModel = require('../models/post.model');


router.get("/:tagID", async function (req, res) {
    const tagId = +req.params.tagID || 0;
    const tagName = await tagModel.findByID(tagId);
    const pageID = +req.query.page || 0;
    const listPost = await postModel.findPostByTagAndPage(tagId, pageID);
    const top5Post = await postModel.getTop5ViewCountByTagId(tagId);
    const top4Post = [];
    const listPostWithTag = [];
    const numPage = await postModel.getTotalPostByTag(tagId);
    if (listPost !== null) {
        for (let index = 1; index < top5Post.length - 1; index++) {
            const element = top5Post[index];
            top4Post.push({
                Title: element.Title,
                PublishDate: element.PublishDate,
                PostID: element.PostID,
                index: index
            });
        }

        for (let index = 0; index < listPost.length; index++) {
            const element = listPost[index];
            const listTag = await tagModel.getAllTagRelatedPost(element.PostID);
            listPostWithTag.push({
                Post: element,
                listTag: listTag,
            })
        }
    }

    const paging = [];
    var pId = pageID - 1;
    var num = +numPage.Total / 5;
    if(num > pId + 5)
        num = pId + 5;
    if(num - pId < 5){
        pId = num - 5;
    }
    if(pId < 0){
        pId = 0;
    }
    for (let index = pId; index < num; index++) {
        paging.push({
            id: index,
            isCurrentPage: index == pageID,
            tagId: tagId,
        })
    }
    res.render("../views/vmTag/tagPage.hbs", {
        isEmpty: listPost === null,
        isTagList: true,
        listPostWithTag: listPostWithTag,
        top4Post: top4Post,
        top5Post: top5Post,
        paging: paging,
        tagName: tagName,
        tagId: tagId,
    });
})

module.exports = router;