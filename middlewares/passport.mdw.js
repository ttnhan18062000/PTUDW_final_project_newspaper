const passport = require("passport");
const passportLocal = require("passport-local");
const localStrategy = passportLocal.Strategy;
const bcrypt = require("bcryptjs");

const accountModel = require("../models/account.model");

module.exports = function (app) {
  passport.use(
    new localStrategy(
      {
        usernameField: "txtEmail",
        passwordField: "txtPassword",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        const account = await accountModel.findByEmail(email);
        if (!account) {
          return done(
            null,
            false,
            req.flash("error_msg", "Your Email or Password not correct")
          );
        }

        const match = await bcrypt.compare(password, account.Password);

        if (match) {
          return done(null, account);
        } else {
          return done(
            null,
            false,
            req.flash("error_msg", "Your Email or Password not correct")
          );
        }
      }
    )
  );

  passport.serializeUser(function (account, done) {
    done(null, account.ID);
  });

  passport.deserializeUser(async function (id, done) {
    const res = await accountModel.findByID(id);
    done(null, res);
  });

  app.use(passport.initialize());
  app.use(passport.session());
};
