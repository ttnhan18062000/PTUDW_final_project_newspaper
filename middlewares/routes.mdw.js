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

    res.render("home", {
      listCategories: listCategories,
      listParentCategories: listParentCategories,
    });
  });

  app.use("/account/", require("../controllers/account.route"));
  app.use('/admin', require("../controllers/admin.route"))
};