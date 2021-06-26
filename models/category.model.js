const categoryChildLaptop = [
        {categoryChildName: 'DELL',},
        {categoryChildName: 'ASUS',},
        {categoryChildName: 'ACER',},
        {categoryChildName: 'MAC'}
];
const categoryChildPhone = [
        {categoryChildName: 'IPHONE',},
        {categoryChildName: 'SAMSUNG',},
        {categoryChildName: 'XIAOMI',},
];

const list = [
    { CatID: 1, categoryName: 'Laptop', categoryChild: categoryChildLaptop },
    { CatID: 2, categoryName: 'Phone', categoryChild: categoryChildPhone},
    { CatID: 3, categoryName: 'Quần áo' },
    { CatID: 4, categoryName: 'Giày dép' },
    { CatID: 5, categoryName: 'Trang sức' },
    { CatID: 6, categoryName: 'Khác' },
];

const db = require('../utils/db');

module.exports = {
    async all() {
        const res = await db.raw("Call GTT_Category()");
        return res[0][0];
    }

};