module.exports = {
  hasAnyRole: function(req, res, next){
    if (req.session.loggedIn) {
      next();
    } else {
      req.session.retUrl = req.originalUrl;
      req.session.requireLogin = true;
      return res.redirect('/');
    }
  },

  hasRole: function(role) {
    return function(req, res, next) {
      if (req.session.loggedIn && req.session.account.AccountType === role) {
        next();
      } else {
        req.session.retUrl = req.originalUrl;
        req.session.requireRole = role;
        return res.redirect('/');
      }
    }
  },

  resBlock: function(req, res, next) {
    if(req.session.serverRouting){
      req.session.serverRouting = undefined;
      next();
    }
    else{
      req.flash('error_msg', 'Sorry you cannot view this resource');
      return res.redirect('/');
    }
  }

  //usertype: writer, editor,..
  //premium
  //autoblock: 
}