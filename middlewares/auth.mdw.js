module.exports = {
  ensureAuth: function(req, res, next) {
    if (req.session.loggedIn) {
      return next();
    }
    req.session.retUrl = req.originalUrl;
    req.session.requireLogin = true;
    res.redirect('/');
  },

  resBlock: function(req, res, next) {
    req.flash('error_msg', 'Sorry you cannot view this resource');
    res.redirect('/');
  }
}