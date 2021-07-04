const express = require('express');
const accountModel = require('../models/account.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { nanoid } = require('nanoid')
const nodemailer = require('nodemailer');
const router = express.Router();
const { ensureAuth, resBlock } = require('../middlewares/auth.mdw');
const moment = require('moment');
const saltRounds = 10;

router.get('/register', async function (req, res) {

  res.render('../views/vmAccount/register.hbs', {
    listCategories: res.locals.listCategories,
    listParentCategories: res.locals.listParentCategories
  });
})

router.post('/register', async function (req, res) {
  req.session.account = { email: req.body.txtEmail, password: req.body.txtPassword };
  res.redirect(`/account/verification-email?email=${req.body.txtEmail}&type=create`);
})

router.get('/is-available', async function (req, res) {
  const email = req.query.Email;
  if (email) {
    const user = await accountModel.findByEmail(email);
    if (user === null) {
      return res.json(true);
    }
  }
  res.json(false);
})

router.get('/is-token-match', function (req, res) {
  const type = req.query.type;

  let token = null;

  if (type === "reset")
    token = req.session.resetToken;
  if (type === "verify")
    token = req.session.verifyToken;

  if (token)
    if (token.Token === req.query.token)
      res.json(true);

  res.json(false);
})

router.get('/send-reset-password-token', async function (req, res) {
  const token = nanoid(8);
  const email = req.query.email;
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'truongtrungnhan.lop9A8@gmail.com',
      pass: 'tnhan18062000'
    }
  });

  var mailOptions = {
    from: 'Nhan Truong <truongtrungnhan.lop9A8@gmail.com>',
    to: email,
    subject: 'Reset Mail From Newspaper',
    html: `<p>Hi ${email},</p>
            <p></p>
            <p>You has requested for reseting password, this is your token</p>
            <h1>${token}</h1>
            <p>If you did not make this request, you can ignore this email</p>
            <p></p>
            <p>Thanks,</p>
            <p>Newspaper</p>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json(error);
    } else {
      req.session.resetToken = { Email: email, Token: token };
      res.json(true);
    }
  });
})

router.get('/send-verify-email-token', async function (req, res) {
  const token = nanoid(8);
  const email = req.query.email;
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'truongtrungnhan.lop9A8@gmail.com',
      pass: 'tnhan18062000'
    }
  });

  var mailOptions = {
    from: 'Nhan Truong <truongtrungnhan.lop9A8@gmail.com>',
    to: email,
    subject: 'Verification Mail From Newspaper',
    html: `<p>Hi ${email},</p>
            <p></p>
            <p>Thank you for register at Newspaper, this is your token for verifying your email</p>
            <h1>${token}</h1>
            <p><b>Why you recieved this email.</b></p>
            <p>Newspaper requires verification whenever an email address is used for creating new account</p>
            <p>If you did not make this request, you can ignore this email</p>
            <p></p>
            <p>Thanks,</p>
            <p>Newspaper</p>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json(error);
    } else {
      req.session.verifyToken = { Email: email, Token: token };
      res.json(true);
    }
  });
})

router.post('/reset-password-request', function (req, res) {

  res.redirect(`/account/reset-password?email=${req.body.txtEmail}`, {
    listCategories: res.locals.listCategories,
    listParentCategories: res.locals.listParentCategories
  });
})

router.get('/reset-password', async function (req, res) {
  res.render('../views/vmAccount/reset-password.hbs', {
    email: req.query.email,
    listCategories: res.locals.listCategories,
    listParentCategories: res.locals.listParentCategories
  });
})

router.post('/reset-password', function (req, res) {
  const password = req.body.txtPassword;

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const res = await accountModel.updatePasswordByEmail(req.query.email, hash);
    });
  });
  res.render('../views/vmAccount/reset-password.hbs', {
    message: 'Password change successfully',
    listCategories: res.locals.listCategories,
    listParentCategories: res.locals.listParentCategories
  });
})

// router.get('/login', async function (req, res) {
//     if(req.session.loginState){
//         const state = req.session.loginState;
//         if(state.failed){      
//             return res.render('../views/vmAccount/login.hbs', { message: state.message});
//         }
//         if(state.success){
//             return res.render('../views/vmAccount/login.hbs');
//         }
//     }
//     return res.render('../views/vmAccount/login.hbs');
// })

router.post('/login', async function (req, res, next) {
  const email = req.body.txtEmail;
  const password = req.body.txtPassword;
  const account = await accountModel.findByEmail(email);

  if (!account) {
    req.session.loginState = { failed: true, message: 'Your Email or Password not correct' };
    return res.redirect(req.get('Referrer'));
  }

  const match = await bcrypt.compare(password, account.Password);

  if (match) {
    req.session.loginState = { success: true, message: "You're logged in" };
    req.session.loggedIn = true;
    req.session.account = account;
    return res.redirect(req.get('Referrer'));
  } else {
    req.session.loginState = { failed: true, message: 'Your Email or Password not correct' };
    return res.redirect(req.get('Referrer'));
  }
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

router.get('/reset-password-request', function (req, res) {
  res.render('../views/vmAccount/reset-password-request.hbs')
});

router.get('/verification-email', function (req, res) {
  res.render('../views/vmAccount/verification-email.hbs', { email: req.query.email, type: req.query.type });
});

router.post('/verification-email', function (req, res) {
  const type = req.query.type;
  if (type === "create") {
    const email = req.session.account.email;
    const password = req.session.account.password;

    req.session.destroy();

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        const newAccount = {
          Password: hash,
          Email: email
        }
        await accountModel.add(newAccount);
      });
    });
    return res.redirect('/account/register-complete-nortification?type=create', {
      listCategories: res.locals.listCategories,
      listParentCategories: res.locals.listParentCategories
    });
  } else {
    const aD = req.session.accountDetail;
    req.session.destroy();
    accountModel.insertOrUpdateByID(aD.id, aD.FName, aD.LName, aD.dob, aD.email);
    return res.redirect('/account/register-complete-nortification?type=edit', {
      listCategories: res.locals.listCategories,
      listParentCategories: res.locals.listParentCategories
    });
  }
})

router.get('/register-complete-nortification', function (req, res) {
  res.render('../views/vmAccount/register-complete-nortification.hbs', {
    listCategories: res.locals.listCategories,
    listParentCategories: res.locals.listParentCategories
  })
});

router.get('/profile', ensureAuth, async function (req, res) {
  const account = req.session.account;
  let accountDetail = await accountModel.findAccountDetailByID(account.ID);
  accountDetail.DOB = moment(accountDetail.DOB).format("DD/MM/YYYY");

  if (accountDetail === null)
    return res.render('../views/vmAccount/profile.hbs', {
      listCategories: res.locals.listCategories,
      listParentCategories: res.locals.listParentCategories
    });
  return res.render('../views/vmAccount/profile.hbs', {
    accountDetail,
    listCategories: res.locals.listCategories,
    listParentCategories: res.locals.listParentCategories
  });
});

router.post('/profile', async function (req, res) {
  const emailChange = req.query.emailChange;
  const email = req.body.txtAEmail;
  const FName = req.body.txtAFName;
  const LName = req.body.txtALName;
  const dob = moment(req.body.txtADOB, 'DD/MM/YYYY').format("YYYY-MM-DD");
  const id = req.session.account.ID;

  if (emailChange === "1") {
    req.session.accountDetail = { id, email, FName, LName, dob };
    return res.redirect(`/account/verification-email?email=${email}&type=edit`);
  } else {
    await accountModel.insertOrUpdateByID(req.session.account.ID, FName, LName, dob, email);
    const account = req.session.account;
    let accountDetail = await accountModel.findAccountDetailByID(account.ID);
    accountDetail.DOB = moment(accountDetail.DOB).format("DD/MM/YYYY");
    return res.render('../views/vmAccount/profile.hbs', {
      message: "Your Account Infomation has been changed",
      accountDetail,
      listCategories: res.locals.listCategories,
      listParentCategories: res.locals.listParentCategories
    });
  }

});

module.exports = router;