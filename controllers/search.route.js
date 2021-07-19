const express = require('express');
const router = express.Router();

const categoryModel = require('../models/category.model');
const postModel = require('../models/post.model');
const tagModel = require('../models/tag.model');

router.get("/:inputString", async function (req, res){
    const inputString = req.params.inputString;
    const pageID = +req.query.page || 0;
    
    const listPost = await postModel.findPostByInputStringAndPage(inputString, pageID);
    const numPage = await postModel.getNumPageByInputString(inputString);
    const numPost = await postModel.getNumPostByInputString(inputString);
    const listPostWithTag = [];
    if (listPost !== null) {
        for (let index = 0; index < listPost.length; index++) {
            const element = listPost[index];
            const listTag = await tagModel.getAllTagRelatedPost(element.ID);
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
            inputString: inputString,
        })
    }
    res.render("../views/vmSearch/searchPage.hbs", {
        isEmpty: listPost === null,
        isCategoryList: true,
        listPostWithTag: listPostWithTag,
        paging: paging,
        numPost: numPost.Total,
        inputString: inputString
    });
})

module.exports = router;