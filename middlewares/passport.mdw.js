const passport = require("passport");
const bcrypt = require("bcryptjs");
const keys = require("../utils/key");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require("cookie-session");

const accountModel = require("../models/account.model");

module.exports = function(app){
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.AccountID);
  });
  
  passport.deserializeUser((id, done) => {
    accountModel.findByID(id)
      .then(user => {
        done(null, user);
      })
  });

  passport.use( new GoogleStrategy(
      {
        clientID: keys.google.ClientID,
        clientSecret: keys.google.ClientSecret,
        callbackURL: '/auth/google/callback'
      },
      async function(accessToken, refreshToken, profile, done){
        if(profile.id){
          const existingExternal = await accountModel.findExternalByID(profile.id, 'google');
          if(existingExternal){
            done(null, existingExternal);
          }
          else{
            const existingUser = await accountModel.findByEmail(profile.emails[0].value);
            if (existingUser){
              const user = await accountModel.insertExternalLink(existingUser.ID, profile.id, 'google');
              
              done(null, user);
            }
            else{
              const user = await accountModel.insertExternalAccount(profile.emails[0].value, profile.id, 'google');
              
              done(null, user);
            }
          }
        }
      }
  ));
}

