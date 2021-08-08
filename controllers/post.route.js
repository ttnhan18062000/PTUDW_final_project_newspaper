const express = require('express');
const postModel = require("../models/post.model");
const tagModel = require("../models/tag.model");
const commentModel = require("../models/comment.model");
const moment = require('moment');
const router = express.Router();

router.get('/:id', async function (req, res) {
    var accountID = -1;
    var accountName = null;
    var hasAccount = false;
    var isPremium = false;
    if (req.session.account != null) {
        accountID = req.session.account.ID;
        accountName = req.session.account.DisplayName;
        hasAccount = true;
        isPremium = req.session.account.PremiumStatus != 0;
    }

    const postId = +req.params.id || 0;
    await postModel.increaseViewCountBy1(postId);
    const post = await postModel.findById(postId);
    post.PublishDate = moment(post.PublishDate).format("YYYY-MM-DD HH:mm:ss");
    const top5RelatedPost = await postModel.find5PostRelatedById(postId);
    const listTag = await tagModel.getAllTagRelatedPost(postId);
    var listComment = await commentModel.getCommentByPost(postId);
    if (listComment !== null) {
        listComment.forEach(comment => {
            comment.Date = moment(comment.Date).local().format("YYYY-MM-DD HH:mm:ss");
        });
        listComment = listComment.reverse();
    }

    res.render('vmPost/postDetail', {
        post: post,
        top5RelatedPost: top5RelatedPost,
        listTag: listTag,
        accountID: accountID,
        accountName: accountName,
        listComment: listComment,
        hasAccount: hasAccount,
        isPremium: isPremium,
    });
})

router.post("/addComment", async function (req, res) {
    const { PostID, AccountID, DateTime, Content } = req.body;
    commentModel.insComment(PostID, AccountID, DateTime, Content);
})

module.exports = router;