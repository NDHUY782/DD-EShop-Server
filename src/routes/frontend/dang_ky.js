
const express = require('express')
const router = express.Router()

const DangKyController = require(`${__path_controllers}frontend/dang_ky_controller`)


router
    .route('/')
    .get(DangKyController.ListSignup)

router
    .route('/ma-kich-hoat')
    .post(DangKyController.ListCheckCode)     


module.exports = router;