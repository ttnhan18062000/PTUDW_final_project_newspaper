const categoryModel = require("../models/category.model");

module.exports = function(app) {
  app.get("/", async function(req, res) {
    if (req.session.loginState) {
      const state = req.session.loginState;
      if (state.failed) {
        return res.render('home', {
          showModal: true,
          message: state.message,
          listCategories: res.locals.listCategories,
          listParentCategories: res.locals.listParentCategories
        });
      }
      if (state.success) {
        return res.render('home', {
          listCategories: res.locals.listCategories,
          listParentCategories: res.locals.listParentCategories
        });
      }
    }
    if (req.session.requireLogin) {
      return res.render('home', {
        showModal: true,
        message: "You need to login to view this resource",
        listCategories: res.locals.listCategories,
        listParentCategories: res.locals.listParentCategories
      });
    }

    res.render("home", {
      listCategories: res.locals.listCategories,
      listParentCategories: res.locals.listParentCategories,
    });
  });

  app.use("/account/", require("../controllers/account.route"));
  app.use('/admin', require("../controllers/admin.route"))
};