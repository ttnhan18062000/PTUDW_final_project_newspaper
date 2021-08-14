const express = require('express');
const router = express.Router();
const dashboardHelper = require('../models/dashboard.helper');


router.use('/categories/', require('./admin/category.route'));

router.use('/posts/', require('./admin/post.route'));
router.use('/accounts/', require('./admin/account.route'));

router.use('/tags/', require('./admin/tag.route'));

router.use('/premium/', require('./admin/premium.route'));

router.get('/dashboard', async function (req, res) {
  const rs = await dashboardHelper.getTotal();
  const [totalPost, totalTag, totalCategory, totalAccount, totalPremiumRequest, 
    totalView, totalComment, totalSubscriber, totalPremiumSubcriber] =rs;
  res.render('vwAdmin/dashboard', {
    layout: 'admin.hbs',
    totalPost, totalTag, totalCategory, totalAccount, totalPremiumRequest, 
    totalView, totalComment, totalSubscriber, totalPremiumSubcriber
  });
});

router.get('/', function (req, res) {
  res.redirect('/admin/dashboard')
});

router.get('*', function (req, res) {
  res.render('vwAdmin/NotFound', {
    layout: false
  });
});


module.exports = router;