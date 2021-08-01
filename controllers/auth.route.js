const express = require('express');
const router = express.Router();
const passport =  require('passport');
const accountModel = require("../models/account.model");

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/google/callback', passport.authenticate('google'), async function(req, res){
    rUrl = req.session.retUrl || req.get('Referrer') || '/';
    const account = await accountModel.findDetailByID(req.user.AccountID);
    const accountDetail = await accountModel.detail(account);
    req.session.account = {...account, [account.AccountType]: accountDetail};
    req.session.loginState = { success: true, loginMessage: "You're logged in" };
    req.session.loggedIn = true;
    return res.redirect(rUrl);
});

router.get('/facebook',
    passport.authenticate('facebook', {
        scope: ['read_stream', 'publish_actions']
    })
);

router.get('/facebook/callback', passport.authenticate('facebook'), async function(req, res){
    rUrl = req.session.retUrl || req.get('Referrer') || '/';
    const account = await accountModel.findDetailByID(req.user.AccountID);
    const accountDetail = await accountModel.detail(account);
    req.session.account = {...account, [account.AccountType]: accountDetail};
    req.session.loginState = { success: true, loginMessage: "You're logged in" };
    req.session.loggedIn = true;
    return res.redirect(rUrl);
});

router.get('/user', function(req, res){
    res.send(req.user);
});

module.exports = router;