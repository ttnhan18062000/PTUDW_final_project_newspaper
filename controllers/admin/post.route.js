const express = require("express");
const postModel = require("../../models/post.model");

const router = express.Router();

// router.get("/add", async function(req, res) {
//   let list = [];
//   try {
//     list = await postModel.all();
//   } catch (e) {
//     console.log(e);
//   }
//   res.render("vwAdmin/vwPosts/add", {
//     layout: "admin.hbs",
//     listCat: list,
//   });
// });

// router.post("/add", async function(req, res) {
//   const new_cat = req.body;

//   try {
//     await categoryModel.add(new_cat);
//   } catch (e) {
//     console.log(e);
//   }
//   res.render("vwAdmin/vwPosts/add", {
//     layout: "admin.hbs",
//   });
// });

// router.get("/is-available", async function(req, res) {
//   const catName = req.query.name;
//   let cat = null;
//   try {
//     cat = await categoryModel.findByName(catName);
//   } catch (e) {
//     console.log(e);
//   }
//   if (cat) {
//     return res.json(false);
//   }
//   res.json(true);
// });

// router.get("/is-editable", async function(req, res) {
//   const newName = req.query.newname;
//   const oldName = req.query.oldname;
//   let catWithNewName = null;
//   try {
//     catWithNewName = await categoryModel.findByName(newName);
//   } catch (e) {
//     console.log(e);
//   }
//   if (catWithNewName) {
//     if (catWithNewName.Name !== oldName) return res.json(false);
//   }
//   res.json(true);
// });

router.get("/edit", async function(req, res) {
  const id = req.query.id || 0;
  let post = null;
  try {
    post = await postModel.findById(id);
  } catch (e) {
    console.log(e);
  }
  if (post === null) {
    return res.redirect("/admin/posts");
  }
  res.render("vwAdmin/vwPosts/edit", {
    layout: "admin.hbs",
    post,
  });
});

// router.post("/patch", async function(req, res) {
//   try {
//     await categoryModel.patch(req.body);
//   } catch (e) {
//     console.log(e);
//   }

//   res.redirect("/admin/categories");
// });

// router.post("/del", async function(req, res) {
//   try {
//     await categoryModel.del(req.body.catID);
//   } catch (e) {
//     console.log(e);
//   }
//   res.redirect("/admin/categories");
// });

router.get("/:id", async function(req, res) {
  const id = +req.params.id || 0;
  let post = null;
  try {
    post = await postModel.findById(id);
  } catch (e) {
    console.log(e);
  }
  res.render("vwAdmin/vwPosts/detail", {
    layout: "admin.hbs",
    post
  });
});

router.get("/", async function(req, res) {
  let list = [];
  try {
    list = await postModel.all();
  } catch (e) {
    console.log(e);
  }
  res.render("vwAdmin/vwPosts/list", {
    layout: "admin.hbs",
    categories: list,
    empty: list.length === 0,
  });
});

module.exports = router;