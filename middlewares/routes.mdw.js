const categoryModel = require("../models/category.model");

module.exports = function(app) {
  app.get("/", async function(req, res) {
    if (req.session.loginState) {
      const state = req.session.loginState;
      req.session.loginState = undefined;
      if (state.failed) {
        if (state.errCode === 1)
          return res.render('home', {
            isHome: true,
            showModal: true,
            message: state.message
          });

        if (state.errCode === 2) {
          return res.redirect(`/account/verification-email?email=${state.accountEmail}&type=create`);
        }
      }
      if (state.success) {
        return res.render('home', {
          isHome: true
        });
      }
    }
    // if (req.session.requireLogin) {
    //   req.session.requireLogin = undefined;
    //   return res.render('home', {
    //     showModal: true,
    //     isHome: true,
    //     loginMessage: "You need to login to view this resource"
    //   });
    // }

    res.render("home", {
      isHome: true
    });
  });



  app.use("/account/", require("../controllers/account.route"));
  app.use('/admin', require("../controllers/admin.route"));
  app.use('/post/', require("../controllers/post.route"));
  app.use('/category/', require("../controllers/category.route"));
  app.use('/tag/', require("../controllers/tag.route"));
};