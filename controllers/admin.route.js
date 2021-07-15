const express = require('express');
const router = express.Router();



router.use('/categories/', require('./admin/category.route'));

router.use('/posts/', require('./admin/post.route'));
router.use('/accounts/', require('./admin/account.route'));

router.use('/tags/', require('./admin/tag.route'));

router.get('/dashboard', function(req, res) {
  res.render('vwAdmin/dashboard', {
    layout: 'admin.hbs'
  });
});

router.get('/', function(req, res) {
  res.redirect('/admin/dashboard')
});

router.get('*', function(req, res) {
  res.render('vwAdmin/NotFound', {
    layout: false
  });
});


module.exports = router;