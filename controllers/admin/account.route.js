const express = require("express");
const moment = require('moment');
const bcrypt = require('bcryptjs');
const accountModel = require("../../models/account.model");
const categoryModel = require("../../models/category.model");


const router = express.Router();

router.get("/add", async function(req, res) {
  const {listType} = require('../../configs/account.cfg');
  res.render("vwAdmin/vwAccounts/add", {
    layout: "admin.hbs",
    listType
  });
});

router.post("/add", async function(req, res) {
  const account = req.body;
  const {password} = account;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      account.password = hash;
      await accountModel.addByAdmin(account);
    })
  });
  
  res.end();
});


router.get("/detail", async function(req, res) {
  const id = req.query.id || 0;
  const account = await accountModel.findDetailByID(id);

  if (!account) {
    return res.redirect("/admin/accounts");
  }

  let item = null;
  let detailLayout = "/admin/accounts";
  let listCategories = [];

  switch (account.AccountType) {
    case 'Subscriber':
      {
      detailLayout = "vwAdmin/vwAccounts/detailSubscriber";
      item = account;
      break;
    }
    case 'Writer':
      {
      detailLayout = 'vwAdmin/vwAccounts/detailWriter';
      item = await accountModel.detailWriter(account.ID);
      item.Alias = item.Alias === 'None'? '' : item.Alias;
      break;
    }
    case 'Editor':{
      detailLayout = 'vwAdmin/vwAccounts/detailEditor';
      categories = await accountModel.detailEditor(account.ID);
      item = {...account, categories};
      listCategories = await categoryModel.all();
      editorCat = categories.map(cat => cat.ID);
      listCategories = listCategories.filter(cat => !editorCat.includes(cat.ID));
      console.log(listCategories)
      listCategories = listCategories.filter(cat => !!cat.ParentCategoryID).
            map(cat => ({...cat, Name: `${cat.ParentName}`+' \u2192 '+`${cat.Name}`}));
      break;
    }
    case 'Adminstrator':
      {
        detailLayout = 'vwAdmin/vwAccounts/detailAdminstrator';
        item = account;
        break;
      }
  }

  item.DOB = item.DOB ? moment(item.DOB, 'DD/MM/YYYY').format('DD/MM/YYYY') : '';

  res.render(detailLayout, {
    layout: "admin.hbs",
    item,
    listCategories,
  });
});

router.post("/delete-category-of-editor", async function(req, res) {
  const {catID, editorID}= req.body;
  await accountModel.delCatOfEditor(catID, editorID);
  res.end();
});

router.post("/insert-category-of-editor", async function(req, res) {
  const {catID, editorID}= req.body;
  await accountModel.insCatOfEditor(catID, editorID);
  res.end();
});

router.post("/update-writer", async function(req, res) {
  const {writerID, alias}= req.body;
  await accountModel.updateWriter(writerID, alias);
  res.end();
});

router.post("/delete", async function(req, res) {
  const account = req.body;
  await accountModel.delete(account);
  res.end();
});

router.get("/", async function(req, res) {
  let list = [];
  list = await accountModel.detailAll();
  res.render("vwAdmin/vwAccounts/list", {
    layout: "admin.hbs",
    accounts: list,
    empty: list.length === 0,
  });
});

module.exports = router;
