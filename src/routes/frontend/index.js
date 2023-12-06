const express = require('express')
const router = express.Router();
const getdataMiddleware = require('../../middleware/data_nonload')
const UserInfoMiddleware = require('../../middleware/get_user_info')

router.use(async (req, res, next) => {
    req.app.set('layout', 'frontend/index.ejs');
    next();
});


// router.use('/' , require('./home'))

// router.use('/dang-nhap',require('./dang_nhap'))
// router.use('/dang-ky',require('./dang_ky'))
// router.use('/blog',require('./blog'))
// router.use('/product',require('./product'))
// router.use('/thanh-toan',require('./thanh_toan'))
router.use('/' , require('./slug'))


module.exports = router