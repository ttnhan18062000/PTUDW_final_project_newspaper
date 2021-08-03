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
const {SIZE} = require("../configs/size.cfg")
const router = express.Router();

router.get("/posts/add", async function(req, res) {
  const allCat = await categoryModel.all();
  const catList = allCat.filter(cat => cat.ParentCategoryID !== null)
                        .map(cat => ({...cat, Name: `${cat.ParentName}`+' \u2192 '+`${cat.Name}`}));
  const tagList = await tagModel.all();
  res.render("vwWriter/addPost", {
    layout: "writer.hbs",
    catList,
    tagList,
  });
});

router.post('/posts/add', async function(req, res) {
  const storage = multer.diskStorage({
    async destination(req, file, cb) {
      let {title, abstract, writer, category, content, premium = '0'} = req.body;
      const tags = req.body.tags? req.body.tags.split(',').filter(e => e.length > 0) : [];
      
      title = title.replace(/'/g, '"');
      abstract = abstract.replace(/'/g, '"');
      content = content.replace(/'/g, '"');
      const {PostID} = await postModel.createByWriter({title, abstract, writer, category, content, premium});
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
      res.redirect('/writer');
    }
  })
});

router.post('/posts/upload', async function(req, res) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `./public/imgs/post`)
    },
    filename(req, file, cb) {
      const date = new Date().getTime();
      req.body.location = `/public/imgs/post/${date}`+ '.' + `${mime.getExtension(file.mimetype)}`
      cb(null, `${date}.${mime.getExtension(file.mimetype)}`)
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
});



router.get("/posts/edit", async function(req, res) {
  const id = req.query.id || 0;
  const post = await postModel.findByID(id);


  if (!post || post.WriterID !== res.locals.account.Writer.ID) {
    return res.redirect("/writer");
  }
  const allCat = await categoryModel.all();
  const catList = allCat.filter(cat => cat.ParentCategoryID !== null)
                        .map(cat => ({...cat, Name: `${cat.ParentName}`+'\u2192'+`${cat.Name}`}));
  const tagList = await tagModel.all();
  let postTags = await postModel.getPostTags(post.PostID);
  postTags = postTags.map(tag => tag.TagID)
  res.render("vwWriter/editPost", {
    layout: "writer.hbs",
    post,
    catList,
    tagList,
    postTags,
  });
});

router.post('/posts/edit', async function(req, res) {
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
      if( req.file === undefined){
        console.log('There no main photo.')
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

      res.redirect('/writer');
    }
  })
})

router.get('/posts/:id', async function(req, res){
  const id = +req.params.id || 0;
  const post = await postModel.findByID(id);
  const listTag = await tagModel.getAllTagRelatedPost(id);
  if (!post || post.WriterID !== res.locals.account.Writer.ID) {
    return res.redirect('/writer');
  }

  res.render("vwWriter/postDetail", {
    layout: "writer.hbs",
    post,
    listTag
  });

})

router.get('/', async function(req, res) {
  const allPost = await postModel.getPostByWriterID(res.locals.account.ID);
  const newAllPost = allPost.map(post => ({...post, PublishDate: formatTime(post.PublishDate)}))
  const Publish = newAllPost.filter(post => post.Status === 'Publish') 
  const Unpublish = newAllPost.filter(post => post.Status === 'Unpublish') 
  const Draft = newAllPost.filter(post => post.Status === 'Draft') 
  const Refused = newAllPost.filter(post => post.Status === 'Refused') 
  res.render('vwWriter/index',{
    layout: 'writer.hbs',
    listPost: {Publish, Unpublish, Draft, Refused},
  });
});

router.get('/posts', function(req,res){
  res.redirect('/writer');
})

router.get('*', function(req, res) {
  res.render('vwAdmin/NotFound', {
    layout: 'writer.hbs'
  });
});


module.exports = router;