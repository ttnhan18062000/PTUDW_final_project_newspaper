const express = require('express');
const router = express.Router();

const categoryModel = require('../models/category.model');
const postModel = require('../models/post.model');
const tagModel = require('../models/tag.model');


router.get("/:categoryID/page=:id", async function (req, res) {
    const categoryId = +req.params.categoryID || 0;
    const categoryName = await categoryModel.findById(categoryId);
    const pageID = +req.params.id || 0;
    const listPost = await postModel.findPostByCategoryAndPage(categoryId, pageID);
    const top5Post = await postModel.getTop5ViewCountByCategoryId(categoryId);
    const top4Post = [];
    const listPostWithTag = [];
    const numPage = await postModel.getNumPageByCategoryID(categoryId);
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
    for (let index = 0; index < +numPage.NumPage; index++) {
        paging.push({
            id: index,
            isCurrentPage: index == pageID,
            categoryId: categoryId,
        })
    }

    res.render("../views/vmCategory/categoryPage.hbs", {
        isEmpty: listPost === null,
        isCategoryList: true,
        listPostWithTag: listPostWithTag,
        top4Post: top4Post,
        top5Post: top5Post,
        paging: paging,
        categoryName: categoryName,
        categoryId: categoryId,
    });
})

module.exports = router;