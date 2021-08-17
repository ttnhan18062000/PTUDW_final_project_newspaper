const express = require('express');
const moment = require('moment');
const { PREMIUM_EXPRIRED_DATE_IN } = require('../../configs/account.cfg');
const accountModel = require('../../models/account.model');
const router = express.Router();

router.post('/accept', async (req, res) => {
  const {accID} = req.body;
  const expiredDate = moment().add(PREMIUM_EXPRIRED_DATE_IN, 'days').format('YYYY/MM/DD');
  await accountModel.acceptPremium(accID, expiredDate);
  res.end();
});

router.get('/', async (req, res) => {
  const listRequest = await accountModel.getPremiumRequests();
  res.render('vwAdmin/vwPremium/list',{
    layout: 'admin.hbs',
    listRequest
  });
});

module.exports = router;