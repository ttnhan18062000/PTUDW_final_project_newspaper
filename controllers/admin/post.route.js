const express = require("express");
const multer = require('multer');
const mime = require('mime');
const moment = require('moment');
const sharp = require('sharp');
const fs = require('fs');
const postModel = require("../../models/post.model");
const categoryModel = require("../../models/category.model");
const tagModel = require("../../models/tag.model");
const accountModel = require("../../models/account.model");
const {SIZE} = require("../../configs/size.cfg")
const router = express.Router();


router.get("/edit", async function(req, res) {
  const id = req.query.id || 0;
  const post = await postModel.findByID(id);

  if (!post) {
    return res.redirect("/admin/posts");
  }
  const allCat = await categoryModel.all();
  const catList = allCat.filter(cat => cat.ParentCategoryID !== null)
                        .map(cat => ({...cat, Name: `${cat.ParentName}`+'\u2192'+`${cat.Name}`}));
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

router.get("/add", async function(req, res) {
  const allCat = await categoryModel.all();
  const catList = allCat.filter(cat => cat.ParentCategoryID !== null)
                        .map(cat => ({...cat, Name: `${cat.ParentName}`+' \u2192 '+`${cat.Name}`}));
  const tagList = await tagModel.all();
  const writerList = await accountModel.allWriters();
  res.render("vwAdmin/vwPosts/add", {
    layout: "admin.hbs",
    catList,
    tagList,
    writerList,
  });
});

router.post('/edit', async function(req, res) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const dir = `./public/imgs/post/${req.body.postID}`;
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
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
<<<<<<< HEAD
      if( req.file === undefined){
        console.log('There no main photo.')
=======
      if( err|| req.file === undefined){
        console.log('There no main photo: ', err)
>>>>>>> ae4da1b23bbe26c6a2d6c083e43e671f844e4246
      }else{
        await sharp(req.file.path).resize(SIZE.THUMBNAIL) 
        .jpeg({
            quality: 40,
        }).toFile(`./public/imgs/post/${postID}/`+'thumb.jpg')
        .catch( err => { console.log('Create thumb error: ', err) })
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

router.post('/add', async function(req, res) {
  const storage = multer.diskStorage({
    async destination(req, file, cb) {
      let {title, abstract, writer, category, content, status, premium = '0'} = req.body;
      const publishDate = moment(req.body.publishDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const tags = req.body.tags? req.body.tags.split(',').filter(e => e.length > 0) : [];
      //create post
      ///replace single quote by double quote to avoid sql syntax error
      title = title.replace(/'/g, '"');
      abstract = abstract.replace(/'/g, '"');
      content = content.replace(/'/g, '"');
      const {PostID} = await postModel.create({title, abstract, writer, category, content, premium, status, publishDate});
      req.body.postID = PostID;
      //Add post tags
      Promise.all(tags.map(tagID => postModel.insertTag(PostID, tagID)));
      const dir = `./public/imgs/post/${PostID}`;
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      cb(null, `./public/imgs/post/${PostID}`)
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
      //generate and create thumbnail
      if(req.file === undefined){
        console.log('There no main photo.')
      }else{
        await sharp(req.file.path).resize(SIZE.THUMBNAIL) 
        .jpeg({
            quality: 40,
        }).toFile(`./public/imgs/post/${req.body.postID}/`+'thumb.jpg')
        .catch( err => { console.log('Create thumb error: ', err) })
      }
      res.redirect('/admin/posts');
    }
  })
})

router.post("/delete", async function(req, res) {
  await postModel.delete(req.body.ID);
  fs.rmdirSync(`./public/imgs/post/${req.body.ID}`, { recursive: true });
  res.end();
});

router.post('/upload', async function(req, res) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `./public/imgs/post`)
    },
    filename(req, file, cb) {
      req.body.location = `/public/imgs/post/${file.originalname}`
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

router.post("/publish", async function(req, res) {
  const {postID, publishDate} = req.body;
  await postModel.publish(postID, publishDate);
  res.end();
});

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