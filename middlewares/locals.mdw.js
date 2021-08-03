const moment = require('moment');

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
    //checking auth
    if (req.session.requireRole) {
      res.locals.showModal = true
      res.locals.loginMessage = `You must login as ${req.session.requireRole}`
      req.session.requireRole = undefined
    }
  
    if(req.session.requireLogin){
      res.locals.showModal = true
      res.locals.loginMessage = `You must login to view this resource`
      req.session.requireLogin = undefined
    }

    if(req.session.account && req.session.account.AccountType === 'Editor'){
      req.session.account.Editor = await categoryModel.getEditorCategories(req.session.account.ID);
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    res.locals.listParentCategories = listParentCategories;
    res.locals.listCategories = listCategories;

    res.locals.account = req.session.account;
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