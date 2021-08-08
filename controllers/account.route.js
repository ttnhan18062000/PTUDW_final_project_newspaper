const express = require('express');
const accountModel = require('../models/account.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { nanoid } = require('nanoid')
const nodemailer = require('nodemailer');
const router = express.Router();
const { hasRole, hasAnyRole, resBlock } = require('../middlewares/auth.mdw');
const moment = require('moment');
const saltRounds = 10;

router.get('/register', async function(req, res) {

  res.render('../views/vmAccount/register.hbs', {
    listCategories: res.locals.listCategories,
    listParentCategories: res.locals.listParentCategories
  });
})

router.post('/register', async function(req, res) {
  
  const email = req.body.txtEmail;
  const password = req.body.txtPassword;
  const otp = nanoid(12);
  req.session.verifyToken = {Token: otp, Email: email};

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
      const newAccount = {
        Password: hash,
        Email: email,
        Otp: otp
      }
      await accountModel.add(newAccount);
    });
  });
  res.redirect(`/account/verification-email?email=${req.body.txtEmail}&type=create`);
})

router.get('/is-available', async function(req, res) {
  const email = req.query.Email;
  if (email) {
    const user = await accountModel.findByEmail(email);
    if (user === null) {
      return res.json(true);
    }
  }
  res.json(false);
})

router.get('/is-token-match', function(req, res) {
  const type = req.query.type;

  let token = null;

  if (type === "reset")
    token = req.session.resetToken;
  if (type === "verify")
    token = req.session.verifyToken;

  if (token)
    if (token.Token === req.query.token) {
      if (type === "reset")
        req.session.verifyToken = undefined;
      if (type === "verify")
        req.session.resetToken = undefined;
      return res.json(true);
    }

  return res.json(false);
})

router.get('/send-reset-password-token', async function(req, res) {
  const token = nanoid(12);
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
    
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      res.json(error);
    } else {
      req.session.resetToken = { Email: email, Token: token };
      res.json(true);
    }
  });
})

router.get('/send-verify-email-token', async function(req, res) {
  const type = req.query.type;
  let token = "sampletoken1"
  if (type === "create")
    token = req.session.verifyToken.Token;
  else
    token = nanoid(12);
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

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return res.json(error);
    } else {
      req.session.verifyToken = { Email: email, Token: token };
      return res.json(true);
    }
  });
})

router.post('/reset-password-request', function(req, res) {
  
  res.redirect(`/account/reset-password?email=${req.body.txtEmail}`);
})

router.get('/reset-password',  async function(req, res) {
  res.render('../views/vmAccount/reset-password.hbs', {
    email: req.query.email
  });
})

router.post('/reset-password',  function(req, res) {
  const password = req.body.txtPassword;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
      const res = await accountModel.updatePasswordByEmail(req.query.email, hash);
    });
  });
  res.render('../views/vmAccount/reset-password.hbs', {
    message: 'Password change successfully'
  });
})

router.post('/login', async function(req, res, next) {
  const email = req.body.txtEmail;
  const password = req.body.txtPassword;
  let account = await accountModel.findByEmail(email);

  if (!account) {
    req.session.loginState = { failed: true, loginMessage: 'Your Email or Password not correct', errCode: 1 };
    rUrl = req.get('Referrer') || '/';
    return res.redirect(rUrl);
  }

  if (account.Status !== null && account.Status === 'inactive') {
    req.session.loginState = { failed: true, loginMessage: 'Your Account is not verified', errCode: 2, accountEmail: email };
    rUrl = req.get('Referrer') || '/';
    return res.redirect(rUrl);
  }

  const match = await bcrypt.compare(password, account.Password);

  if (match) {
    account = await accountModel.findDetailByID(account.ID); 

    req.session.loginState = { success: true, loginMessage: "You're logged in" };
    req.session.loggedIn = true;
    const accountDetail = await accountModel.detail(account)
    req.session.account = {...account, [account.AccountType]: accountDetail}
    
    rUrl = req.session.retUrl || req.get('Referrer') || '/';
    return res.redirect(rUrl);
  } else {
    req.session.loginState = { failed: true, loginMessage: 'Your Email or Password not correct' };
    rUrl = req.get('Referrer') || '/';
    return res.redirect(rUrl);
  }
})

router.get('/logout', (req, res) => {
  req.session.account = undefined;
  req.session.loggedIn = undefined;
  //return res.redirect(req.get('Referrer'));
  return res.redirect('/');
});

router.get('/reset-password-request', function(req, res) {
  
  return res.render('../views/vmAccount/reset-password-request.hbs')
});

router.get('/verification-email', async function(req, res) {
  const vtype = req.query.type;
  const vemail = req.query.email;
  if (vtype === 'create') {
    const account = await accountModel.findByEmail(vemail);
    req.session.account = account;
    req.session.verifyToken = { Email: vemail, Token: account.Otp };
  }
  return res.render('../views/vmAccount/verification-email.hbs', { email: vemail, type: vtype });
});

router.post('/verification-email', function(req, res) {
  
  const type = req.query.type;
  if (type === "create") {
    const email = req.query.email;
    accountModel.updateStatusActiveByEmail(email);
    return res.redirect('/account/register-complete-nortification?type=create');
  } else {
    const aD = req.session.accountDetail;
    req.session.accountDetail = undefined;
    accountModel.insertOrUpdateByID(aD.id, aD.FName, aD.LName, aD.dob, aD.email);
    return res.redirect('/account/register-complete-nortification?type=edit');
  }
})

router.get('/register-complete-nortification',  async function(req, res) {
  res.render('../views/vmAccount/register-complete-nortification.hbs')
});

router.get('/profile', hasAnyRole, async function(req, res) {
  // const account = req.session.account;
  // let accountDetail = await accountModel.detail(account);
  // accountDetail.DOB = moment(accountDetail.DOB).format("DD/MM/YYYY");

  let descriptions = [];
  switch(req.session.account.AccountType){
    case "Subscriber":
      descriptions.push({'desp': 'Tài khoản của bạn là một đọc giả.'});
      descriptions.push({'desp': 'Bạn có thể xem các bài báo và đưa ra nhận xét.'});
      descriptions.push({'desp': 'Để xem các bài báo premium, vui lòng gửi yêu cầu đăng ký premium cho quản trị viên.'});
      break;
    case "Writer":
      descriptions.push({'desp': 'Tài khoản của bạn là một phóng viên.'});
      descriptions.push({'desp': 'Bạn có thể viết các bài báo và gửi yêu cầu duyệt lên các biên tập viên.'});
      descriptions.push({'desp': 'Nếu được duyệt, bài báo của bạn sẽ được đăng vào một ngày cố định. Ngược lại, nếu bị từ chối, bạn có thể xem ghi chú của biên tập viên và gửi yêu cầu duyệt lại sau khi đã sửa đổi.'});
      break;
    case "Editor":
      descriptions.push({'desp': 'Tài khoản của bạn là một biên tập viên.'});
      descriptions.push({'desp': 'Bạn có thể duyệt các bài báo do phóng viên đăng lên các chuyên mục do bạn quản lý.'});
      descriptions.push({'desp': 'Nếu từ chối vui lòng đưa ra nhận xét cụ thể.'});
      break;
    case "Adminstrator":
      descriptions.push({'desp': 'Tài khoản của bạn là một quản trị viên'});
      descriptions.push({'desp': 'Bạn có toàn quyền thay đổi thông tin của tài khoản, bài báo, chuyên mục,...'});
    break;
  }

  if (!req.session.account)
    return res.render('../views/vmAccount/profile.hbs');
  return res.render('../views/vmAccount/profile.hbs', {'descriptions' : descriptions});
});

router.post('/profile', hasAnyRole, async function(req, res) {
  const emailChange = req.query.emailChange;
  const email = req.body.txtAEmail;
  const DName = req.body.txtADName;
  const FName = req.body.txtAFName;
  const LName = req.body.txtALName;
  const dob = moment(req.body.txtADOB, 'DD/MM/YYYY').format("YYYY-MM-DD");
  const id = req.session.account.ID;

  if (emailChange === "1") {
    req.session.accountDetail = { id, email, DName, FName, LName, dob };
    return res.redirect(`/account/verification-email?email=${email}&type=edit`);
  } else {
    await accountModel.insertOrUpdateByID(req.session.account.ID, DName, FName, LName, dob, email);
    
    const account = await accountModel.findDetailByID(req.session.account.ID);
    const accountDetail = await accountModel.detail(account);
    req.session.account = {...account, [account.AccountType]: accountDetail};

    return res.redirect('/account/profile');
  }

});

module.exports = router;