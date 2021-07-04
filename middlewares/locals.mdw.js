const categoryModel = require("../models/category.model");

module.exports = function(app) {
  app.use(async function(req, res, next) {
    if (typeof req.session.auth === "undefined") {
      req.session.auth = false;
    }

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

    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    res.locals.listParentCategories = listParentCategories;
    res.locals.listCategories = listCategories;
    next();
  });

  app.use(async(req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/admin")) {
      res.locals.lcNavItems = getNavItems(url);
    }
    next();
  });
};

const getNavItems = function(url) {
  let navItems = [{
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: "fa fa-tachometer",
      class: "",
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: "fa fa-list-alt",
      class: "",
    },
    {
      name: "Posts",
      href: "/admin/posts",
      icon: "fa fa-pencil-square",
      icon: "fa fa-pencil-square-o",
      class: "",
    },
    {
      name: "Accounts",
      href: "/admin/accounts",
      icon: "fa fa-users",
      class: "",
    },
    {
      name: "Tags",
      href: "/admin/tags",
      icon: "fa fa-tags",
      class: "",
    },
  ];
  const itemName = url.split("/")[2];
  navItems = navItems.map((item) =>
    item.name.toLowerCase() === itemName ? {...item, class: "active" } : item
  );
  return navItems;
};