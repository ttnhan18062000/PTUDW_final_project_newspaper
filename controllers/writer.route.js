const express = require('express');
const postModel = require('../models/post.model');
const { formatTime } = require('../utils/time');
const router = express.Router();


router.get('/post/:id', async function(req, res){
  const id = +req.params.id || 0;
  const post = await postModel.findByID(id);
  if (!post || post.WriterID !== res.locals.account.Writer.ID) {
    return res.redirect('/writer');
  }

  res.render("vwWriter/Postdetail", {
    layout: "writer.hbs",
    post,
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

router.get('*', function(req, res) {
  res.render('vwAdmin/NotFound', {
    layout: false
  });
});


module.exports = router;