const express = require("express");
const multer = require('multer');
const mime = require('mime');
const sharp = require('sharp');
const postModel = require("../../models/post.model");
const categoryModel = require("../../models/category.model");
const tagModel = require("../../models/tag.model");
const accountModel = require("../../models/account.model");

const router = express.Router();


router.get("/edit", async function(req, res) {
  const id = req.query.id || 0;
  const post = await postModel.findByID(id);

  if (!post) {
    return res.redirect("/admin/posts");
  }
  const allCat = await categoryModel.all();
  const catList = allCat.filter(cat => cat.ParentCategoryID !== null)
                        .map(cat => ({...cat, Name: `${cat.ParentName}>>${cat.Name}`}));
  const tagList = await tagModel.all();
  const writerList = await accountModel.allWriters();
  let postTags = await postModel.getPostTags(post.PostID);
  postTags = postTags.map(tag => tag.TagID)
  res.render("vwAdmin/vwPosts/edit", {
    layout: "admin.hbs",
    post,
    catList,
    tagList,
    postTags,
    writerList,
  });
});

router.post('/edit', async function(req, res) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `./public/imgs/post/${req.body.postID}`)
    },
    filename(req, file, cb) {
      cb(null, 'main' + '.' + 'jpg');
    }
  });
  const upload = multer({
    storage
  });

  upload.single('imgMain')(req, res, async function (err) {
    if (err) {
      console.log(err);
    } else {
      let {postID, title, abstract, writer, category, content, premium = '0', tags = [], originTags = [] } = req.body;
      //generate and create thumbnail
      if( err|| req.file === undefined){
        console.log(err)
      }else{
        await sharp(req.file.path).resize({ height:400, width: 400}) 
        .jpeg({
            quality: 40,
        }).toFile(`./public/imgs/post/${postID}/`+'thumb.jpg')
        .catch( err => { console.log('error: ', err) })
      }

      //update post
      ///replace single quote by double quote to avoid sql syntax error
      title = title.replace(/'/g, '"');
      abstract = abstract.replace(/'/g, '"');
      content = content.replace(/'/g, '"');
      await postModel.patch({postID, title, abstract, writer, category, content, premium});

      //update post tags
      tags = tags.split(',').filter(e => e.length > 0)
      originTags = originTags.split(',').filter(e => e.length > 0)
      deleteTags = originTags.filter(tag => !tags.includes(tag));
      insertTags = tags.filter(tag => !originTags.includes(tag));
      Promise.all(deleteTags.map(tagID => postModel.deleteTag(postID, tagID)));
      Promise.all(insertTags.map(tagID => postModel.insertTag(postID, tagID)));

      res.redirect('/admin/posts');
    }
  })
})

router.post('/upload', async function(req, res) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `./public/imgs/post/${req.body.postID}/`)
    },
    filename(req, file, cb) {
      req.body.location = `/public/imgs/post/${req.body.postID}/${file.originalname}`
      cb(null, file.originalname)
    }
  });
  const upload = multer({
    storage
  });

  upload.single('file')(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.json({location: req.body.location});
    }
  })
})

router.get("/:id", async function(req, res) {
  const id = +req.params.id || 0;
  const post = await postModel.findByID(id);
  if (!post) {
    return res.redirect('/admin/posts');
  }
  res.render("vwAdmin/vwPosts/detail", {
    layout: "admin.hbs",
    post
  });
});

router.get("/", async function(req, res) {
  const list = await postModel.all();

  res.render("vwAdmin/vwPosts/list", {
    layout: "admin.hbs",
    list,
    empty: list.length === 0,
  });
});

module.exports = router;