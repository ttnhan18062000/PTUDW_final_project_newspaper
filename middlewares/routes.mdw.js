const categoryModel = require("../models/category.model");

module.exports = function(app) {
  app.get("/", async function(req, res) {
    const list = await categoryModel.all();
    const listCategories = [];
    const listParentCategories = [];

    let count = 7;
    list.forEach((parent) => {
      if (parent.ParentCategoryID === null) {
        const temp = [];
        list.forEach((child) => {
          if (child.ParentCategoryID === parent.ID) {
            const newChild = {
              ID: child.ID,
              Name: child.Name,
              listChildCategories: null,
            };
            temp.push(newChild);
          }
        });
        const newParent = {
          ID: parent.ID,
          Name: parent.Name,
          listChildCategories: temp,
        };
        listCategories.push(newParent);
        if (count > 0) {
          listParentCategories.push({ ID: parent.ID, Name: parent.Name });
          count = count - 1;
        }
      }
    });

    if (req.session.loginState) {
      const state = req.session.loginState;
      if (state.failed) {
        return res.render('home', {
          showModal: true,
          message: state.message,
          listCategories: listCategories,
          listParentCategories: listParentCategories
        });
      }
      if (state.success) {
        return res.render('home', {
          listCategories: listCategories,
          listParentCategories: listParentCategories
        });
      }
    }
    if (req.session.requireLogin) {
      return res.render('home', {
        showModal: true,
        message: "You need to login to view this resource",
        listCategories: listCategories,
        listParentCategories: listParentCategories
      });
    }

    res.render("home", {
      listCategories: listCategories,
      listParentCategories: listParentCategories,
    });
  });

  app.use("/account/", require("../controllers/account.route"));
  app.use('/admin', require("../controllers/admin.route"))
};