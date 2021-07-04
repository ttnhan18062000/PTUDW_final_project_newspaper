const express = require("express");
const tagModel = require("../../models/tag.model");

const router = express.Router();

router.get("/add", async function(req, res) {
  const list = await tagModel.all();
  res.render("vwAdmin/vwTags/add", {
    layout: "admin.hbs",
    listCat: list,
  });
});

router.post("/add", async function(req, res) {
  await tagModel.add(req.body.name);
  res.render("vwAdmin/vwTags/add", {
    layout: "admin.hbs",
  });
});

router.get("/is-available", async function(req, res) {
  const item = await tagModel.findByName(req.query.name);
  if (item) {
    return res.json(false);
  }
  res.json(true);
});

router.get("/is-editable", async function(req, res) {
  const newName = req.query.newname;
  const oldName = req.query.oldname;
  itemWithNewName = await tagModel.findByName(newName);
  if (itemWithNewName && itemWithNewName.Name !== oldName) {
    return res.json(false);
  }
  res.json(true);
});

router.get("/edit", async function(req, res) {
  const id = +req.query.id || 0;
  const item = await tagModel.findByID(id);
  console.log(item)
  if(item){
    return res.render("vwAdmin/vwTags/edit", {
      layout: "admin.hbs",
      item,
    });
  }
  res.redirect('/admin/tags');
});

router.post("/patch", async function(req, res) {
  await tagModel.patch(req.body);
  res.redirect("/admin/tags");
});

router.post("/delete", async function(req, res) {
  await tagModel.delete(req.body.ID);
  res.end();
});

router.get("/", async function(req, res) {
  let list = [];
  list = await tagModel.all();
  res.render("vwAdmin/vwTags/list", {
    layout: "admin.hbs",
    list,
    empty: list.length === 0,
  });
});

module.exports = router;