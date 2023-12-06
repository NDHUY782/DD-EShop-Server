// const express = require('express')
// const router = express.Router();
// const frontendhelper = require('../helpers/frontendhelper')


// module.exports = async (req, res, next) => {
//     await frontendhelper.getMenu(req).then((result) => {
//         res.locals.listMenu = result.data
//         res.locals.search = ''
//     })
//     await frontendhelper.getSetting(req).then((result) => {
//         res.locals.listSetting = result.dataSetting
//     })
//     await frontendhelper.getCategory(req).then((result) => {
//         res.locals.listCategory = result.data
//     })
//     await frontendhelper.getProductCategory(req).then((result) => {
//         res.locals.listProductCategory = result.data
//     })
//     next()
//   };