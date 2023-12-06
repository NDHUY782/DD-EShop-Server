const express = require('express')
const router = express.Router()
const loginMiddleware = require('../../middleware/login')
const loginManagerMiddleware = require('../../middleware/check_login_manage')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../lib/swagger.json');


router.use((req, res, next) => {
    req.app.set('layout', 'backend/index.ejs');
    next();
});

router.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// router.use('/authen',require('./authen'))
router.use('/no-permission',require('./no_permission'))

router.use('/' ,require('./dashboard'))
// router.use('/',require('./dashboard'))

router.use('/rss',require('./rss'))
router.use('/setting',require('./setting'))
router.use('/phiVanChuyen',require('./phiVanChuyen'))
router.use('/maGiamGia',require('./maGiamGia'))
router.use('/donHang',require('./donHang'))
router.use('/menu',require('./menu'))
router.use('/category',require('./category'))
router.use('/category_product',require('./category_product'))
router.use('/article',require('./article'))
router.use('/product',require('./product'))
router.use('/slider',require('./slider'))
router.use('/contact',require('./contact'))

router.use('/category_account',require('./category_account'))
router.use('/account',require('./account'))

router.use('/api',require('./user'))


// router.use('/user',require('./user'))
// router.use('/group',require('./group'))
module.exports = router
