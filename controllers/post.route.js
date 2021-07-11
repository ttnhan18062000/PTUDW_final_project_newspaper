const express = require('express');
const postModel = require("../models/post.model");
const tagModel = require("../models/tag.model");
const router = express.Router();

router.get('/byPost/:id', async function(req, res){
    const postId = +req.params.id || 0;
    const post = await postModel.findById(postId);
    const top5RelatedPost = await postModel.find5PostRelatedById(postId);
    const listTag = await tagModel.getAllTagRelatedPost(postId);
    res.render('vmPost/postDetail', {
        post: post,
        top5RelatedPost: top5RelatedPost,
        listTag: listTag,
    });
})

module.exports = router;