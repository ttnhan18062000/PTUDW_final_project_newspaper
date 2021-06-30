const express = require("express");
const accountModel = require("../models/account.model");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const router = express.Router();
const { ensureAuth, resBlock } = require('../middlewares/auth.mdw');
const saltRounds = 10;

router.get("/register", async function(req, res) {
  res.render("../views/vmAccount/register.hbs");
});

router.post("/register", async function(req, res) {
  req.session.account = {
    email: req.body.txtEmail,
    password: req.body.txtPassword,
  };
  res.redirect(`/account/verification-email?email=${req.body.txtEmail}`);
});

router.get("/is-available", async function(req, res) {
  const email = req.query.Email;
  if (email) {
    const user = await accountModel.findByEmail(email);
    if (user === null) {
      return res.json(true);
    }
    res.json(false);
  }
});

router.get('/is-token-match', function(req, res) {
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

router.get('/send-reset-password-token', async function(req, res) {
  const token = nanoid(8);
  const email = req.query.email;
  console.log(token);
  console.log(email);
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
  const token = nanoid(8);
  const email = req.query.email;
  console.log(token);
  console.log(email);
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
            <p>Newspaper</p>`,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      res.json(error);
    } else {
      req.session.verifyToken = { Email: email, Token: token };
      res.json(true);
    }
  });
});

router.post("/reset-password-request", function(req, res) {
  res.redirect(`/account/reset-password?email=${req.body.txtEmail}`);
});

router.get("/reset-password", async function(req, res) {
  res.render("../views/vmAccount/reset-password.hbs", {
    email: req.query.email,
  });
});

router.post("/reset-password", function(req, res) {
  const password = req.body.txtPassword;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
      const res = await accountModel.updatePasswordByEmail(
        req.query.email,
        hash
      );
      console.log(res);
    });
  });
  res.render("../views/vmAccount/reset-password.hbs", {
    message: "Password change successfully",
  });
});

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

router.post('/login', async function(req, res, next) {
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
    req.session.user = account;
    return res.redirect(req.get('Referrer'));
  } else {
    req.session.loginState = { failed: true, message: 'Your Email or Password not correct' };
    return res.redirect(req.get('Referrer'));
  }
})
router.get("/login", async function(req, res) {
  res.render("../views/vmAccount/login.hbs", { message: req.flash("message") });
});

router.post("/login", async function(req, res, next) {
  console.log(req.body);
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/account/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

router.get("/reset-password-request", function(req, res) {
  res.render("../views/vmAccount/reset-password-request.hbs");
});

router.get("/verification-email", function(req, res) {
  res.render("../views/vmAccount/verification-email.hbs", {
    email: req.query.email,
  });
});

router.post("/verification-email", function(req, res) {
  const email = req.session.account.email;
  const password = req.session.account.password;

  req.session.destroy();

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
      const newAccount = {
        Password: hash,
        Email: email,
      };
      await accountModel.add(newAccount);
    });
  });
  res.redirect("/account/register-complete-nortification");
});

router.get("/register-complete-nortification", function(req, res) {
  res.render("../views/vmAccount/register-complete-nortification.hbs");
});

router.get('/profile', ensureAuth, function(req, res) {
  res.render('../views/vmAccount/profile.hbs');
});

module.exports = router;