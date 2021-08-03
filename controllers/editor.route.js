const express = require('express');
const categoryModel = require('../models/category.model');
const postModel = require('../models/post.model');
const tagModel = require('../models/tag.model');
const { formatTime } = require('../utils/time');
const multer = require('multer');
const mime = require('mime');
const moment = require('moment');
const sharp = require('sharp');
const fs = require('fs');
const { SIZE } = require("../configs/size.cfg")
const router = express.Router();

router.get("/posts/publish", async function (req, res) {
  const id = req.query.id || 0;
  const post = await postModel.findByID(id);
  const listCat = res.locals.account.Editor;
  //post not found || post not in list categories of editor || post not draft
  if (!post || post.Status !== 'Draft' || listCat.length === 0 || listCat.every(cat => cat.ID !== post.CategoryID)) {
    return res.redirect("/editor");
  }
  const allCat = await categoryModel.all();
  const catList = allCat.filter(cat => cat.ParentCategoryID !== null)
    .map(cat => ({ ...cat, Name: `${cat.ParentName}` + '\u2192' + `${cat.Name}` }));
  const tagList = await tagModel.all();
  let postTags = await postModel.getPostTags(post.PostID);
  postTags = postTags.map(tag => tag.TagID)
  res.render("vwEditor/publishPost", {
    layout: "editor.hbs",
    post,
    catList,
    tagList,
    postTags,
  });
});

router.post('/posts/publish', async (req, res) => {
  let {oldCatID, postID, category, publishDate, originTags, tags} = req.body;
  publishDate = moment(publishDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  tags = tags.split(',').filter(e => e.length > 0)
  originTags = originTags.split(',').filter(e => e.length > 0)
  deleteTags = originTags.filter(tag => !tags.includes(tag));
  insertTags = tags.filter(tag => !originTags.includes(tag));

  await Promise.all(deleteTags.map(tagID => postModel.deleteTag(postID, tagID)));
  await Promise.all(insertTags.map(tagID => postModel.insertTag(postID, tagID)));

  await postModel.publishPostByEditor(postID, publishDate, category);

  res.redirect(`/editor/categories/${oldCatID}`);
});

router.get("/posts/refuse", async function (req, res) {
  const id = req.query.id || 0;
  const post = await postModel.findByID(id);
  const listCat = res.locals.account.Editor;
  //post not found || post not in list categories of editor || post not draft
  if (!post || post.Status !== 'Draft' || listCat.length === 0 || listCat.every(cat => cat.ID !== post.CategoryID)) {
    return res.redirect("/editor");
  }
  res.render("vwEditor/refusePost", {
    layout: "editor.hbs",
    post,
  });
});

router.post('/posts/refuse', async (req, res) => {
  const {catID, postID, note} = req.body;
  const accID = res.locals.account.ID;
  const date = moment().format('YYYY/MM/DD');

  await postModel.refusePostByEditor(accID, postID, date, note);

  res.redirect(`/editor/categories/${catID}`);
});

router.get("/posts/:id", async function (req, res) {
  const postId = +req.params.id || 0;
  const post = await postModel.findById(postId);
  
  const listCat = res.locals.account.Editor;

  //post not found || post not in list categories of editor || post not draft
  if (!post || post.Status !== 'Draft' || listCat.length === 0 || listCat.every(cat => cat.ID !== post.CategoryID)) {
    return res.redirect("/editor");
  }
  const listTag = await tagModel.getAllTagRelatedPost(postId);
  res.render('vwEditor/postDetail', {
    layout: "editor.hbs",
    post: post,
    listTag: listTag,
  });
});


router.get('/categories/:id', async function (req, res) {
  const id = +req.params.id || 0;
  const listCat = res.locals.account.Editor;
  if (listCat.length === 0 || listCat.every((cat) => cat.ID !== id)) {
    res.redirect("/editor");
  }
  
  listCat.forEach(cat => { cat.isActive = cat.ID === id });
  const listPost = await postModel.getDraftPostByCatID(id);

  await Promise.all(listPost.map(async (post) => {
    let postTags = await postModel.getPostTags(post.PostID);
    post.tags = postTags;
  }));

  const activeCat = listCat.find(cat => cat.ID === id);
  res.render("vwEditor/draftPost", {
    layout: "editor.hbs",
    listPost,
    isEmpty: listPost.length === 0,
    activeCat
  });

})


router.get('/', function (req, res) {
  res.redirect('/editor/categories')

});

router.get('/categories', async function (req, res) {
  res.locals.account.Editor.forEach(cat => { cat.isActive = false });
  res.render('vwEditor/index', {
    layout: 'editor.hbs',
  });
})

router.get('*', function (req, res) {
  res.render('vwAdmin/NotFound', {
    layout: 'editor.hbs'
  });
});


module.exports = router;