module.exports = {
  ensureAuth: function(req, res, next) {
    if (req.session.loggedIn) {
      return next();
    }
    req.session.retUrl = req.originalUrl;
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/');
  },

  resBlock: function(req, res, next) {
    req.flash('error_msg', 'Sorry you cannot view this resource');
    res.redirect('/');
  }
}