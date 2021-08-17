const express = require('express');
const router = express.Router();

const categoryModel = require('../models/category.model');
const postModel = require('../models/post.model');
const tagModel = require('../models/tag.model');

router.get("/", async function (req, res){
    const inputString = req.query.keyword;
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
    var pId = pageID - 1;
    var num = +numPage.NumPage;
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

router.get("/title", async function (req, res){
    const inputString = req.query.keyword;
    const pageID = +req.query.page || 0;
    
    const listPost = await postModel.findPostByInputStringAndPageTitle(inputString, pageID);
    const numPage = await postModel.getNumPageByInputStringTitle(inputString);
    const numPost = await postModel.getNumPostByInputStringTitle(inputString);
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
    var pId = pageID - 1;
    var num = +numPage.NumPage;
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
            inputString: inputString,
        })
    }
    res.render("../views/vmSearch/searchPage.hbs", {
        isEmpty: listPost === null,
        isCategoryList: true,
        listPostWithTag: listPostWithTag,
        paging: paging,
        numPost: numPost.Total,
        inputString: inputString,
        isTitle: true
    });
})

router.get("/abstract", async function (req, res){
    const inputString = req.query.keyword;
    const pageID = +req.query.page || 0;
    
    const listPost = await postModel.findPostByInputStringAndPageAbstract(inputString, pageID);
    const numPage = await postModel.getNumPageByInputStringAbstract(inputString);
    const numPost = await postModel.getNumPostByInputStringAbstract(inputString);
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
    var pId = pageID - 1;
    var num = +numPage.NumPage;
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
            inputString: inputString,
        })
    }
    res.render("../views/vmSearch/searchPage.hbs", {
        isEmpty: listPost === null,
        isCategoryList: true,
        listPostWithTag: listPostWithTag,
        paging: paging,
        numPost: numPost.Total,
        inputString: inputString,
        isAbstract: true
    });
})

router.get("/content", async function (req, res){
    const inputString = req.query.keyword;
    const pageID = +req.query.page || 0;
    
    const listPost = await postModel.findPostByInputStringAndPageContent(inputString, pageID);
    const numPage = await postModel.getNumPageByInputStringContent(inputString);
    const numPost = await postModel.getNumPostByInputStringContent(inputString);
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
    var pId = pageID - 1;
    var num = +numPage.NumPage;
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
            inputString: inputString,
        })
    }
    res.render("../views/vmSearch/searchPage.hbs", {
        isEmpty: listPost === null,
        isCategoryList: true,
        listPostWithTag: listPostWithTag,
        paging: paging,
        numPost: numPost.Total,
        inputString: inputString,
        isContent: true
    });
})

module.exports = router;