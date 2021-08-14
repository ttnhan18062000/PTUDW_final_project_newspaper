const categoryModel = require("../models/category.model");
const moment = require('moment');
const { hasRole } = require("./auth.mdw");

const postModel = require("../models/post.model");

async function getTop10CateWithTop10Post(){
  const listTop10Category = await categoryModel.getTop10CategoryByViewPoint();
  const listReturn = [];
  for (let index = 0; index < listTop10Category.length; index++) {
    const element = listTop10Category[index];
    const listTop10 = await postModel.getTop10PostACateByViewPoint(element.ID);
    listTop10.forEach(item => {
      listReturn.push(item);
    });
  }
  return listReturn.reverse();
};

module.exports = function (app) {
  app.get("/", async function (req, res) {
    const list10PostByDate = await postModel.getTop10PostByDate();
    list10PostByDate.forEach(element => {
      element.PublishDate = moment(element.PublishDate).format("hh:mm");
    });

    const list10PostByViewCount = await postModel.getTop10PostByViewCount();
    var count = 1;
    list10PostByViewCount.forEach(element => {
      element.PublishDate = moment(element.PublishDate).format("hh:mm");
      Object.assign(element, { index: count });
      count = count + 1;
    });

    const list10PostPerCat = await getTop10CateWithTop10Post();
    count = 0;
    const list10PostPerCatReturn = [];
    var listPostACat = [];
    for (let index = 0; index < list10PostPerCat.length; index++) {
      const element = list10PostPerCat[index];
      element.PublishDate = moment(element.PublishDate).format('LL');
      if (count % 2 == 0) {
        Object.assign(element, { leftPos: true })
      }
      else {
        Object.assign(element, { leftPos: false });
      }
      listPostACat.push(element);
      count = count + 1;
      if (count == 10) {
        list10PostPerCatReturn.push({
          CategoryName: element.CategoryName,
          ListTop2Post: listPostACat.slice(0, 2),
          ListTop8Post: listPostACat.slice(2)
        });
        count = 0; listPostACat = [];
      }
    }
    const listTopLatestPost10Category = await postModel.getTopLatestPost10Category();
    var listTop4PostPerWeek = await postModel.getTop4Post();
    listTop4PostPerWeek.forEach(element => {
      element.PublishDate = moment(element.PublishDate).format('LL');
    });

    count = 0;
    listTopLatestPost10Category.forEach(element => {
      element.PublishDate = moment(element.PublishDate).format("LL");
      if (count % 2 == 0) {
        Object.assign(element, { leftPos: true })
      }
      else {
        Object.assign(element, { leftPos: false });
      }
      count = count + 1;
    });
    const listTop3PostPerWeek = listTop4PostPerWeek.slice(1,4);
    if (req.session.loginState) {
      const state = req.session.loginState;
      req.session.loginState = undefined;
      if (state.failed) {
        if (state.errCode === 1)
          return res.render('home', {
            isHome: true,
            showModal: true,
            message: state.message,
            list10PostByDate: list10PostByDate,
            list10PostByViewCount: list10PostByViewCount,
            list10PostPerCatReturn: list10PostPerCatReturn,
            listTopLatestPost10Category: listTopLatestPost10Category,
            listTop4PostPerWeek: listTop4PostPerWeek,
            listTop3PostPerWeek: listTop3PostPerWeek,
          });

        if (state.errCode === 2) {
          return res.redirect(`/account/verification-email?email=${state.accountEmail}&type=create`);
        }
      }
      if (state.success) {
        return res.render('home', {
          isHome: true,
          list10PostByDate: list10PostByDate,
          list10PostByViewCount: list10PostByViewCount,
          list10PostPerCatReturn: list10PostPerCatReturn,
          listTopLatestPost10Category: listTopLatestPost10Category,
          listTop4PostPerWeek: listTop4PostPerWeek,
          listTop3PostPerWeek: listTop3PostPerWeek
        });
      }
    }

    res.render("home", {
      isHome: true,
      list10PostByDate: list10PostByDate,
      list10PostByViewCount: list10PostByViewCount,
      list10PostPerCatReturn: list10PostPerCatReturn,
      listTopLatestPost10Category: listTopLatestPost10Category,
      listTop4PostPerWeek: listTop4PostPerWeek,
      listTop3PostPerWeek: listTop3PostPerWeek
    });
  });



  app.use("/account/", require("../controllers/account.route"));
  app.use('/admin', require("../controllers/admin.route"));
  app.use('/post/', require("../controllers/post.route"));
  app.use('/category/', require("../controllers/category.route"));
  app.use('/tag/', require("../controllers/tag.route"));
  app.use('/search', require("../controllers/search.route"));
  app.use('/writer', hasRole('Writer'), require("../controllers/writer.route"));
  app.use('/editor', hasRole('Editor'), require("../controllers/editor.route"));
  app.use('/auth', require("../controllers/auth.route"));
};