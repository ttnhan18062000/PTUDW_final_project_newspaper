module.exports = function(app) {
  app.use(function(req, res, next) {
    if (typeof req.session.auth === "undefined") {
      req.session.auth = false;
    }

    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
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
      icon: "icon-dashboard",
      class: "",
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: "icon-list-alt",
      class: "",
    },
  ];
  const itemName = url.split("/")[2];
  navItems = navItems.map((item) =>
    item.name.toLowerCase() === itemName ? {...item, class: "active" } : item
  );
  return navItems;
};