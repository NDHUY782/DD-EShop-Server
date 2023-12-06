
const express = require('express')
const router = express.Router()

const DangNhapController = require(`${__path_controllers}frontend/dang_nhap_controller`)

router
    .route('/')
    .get(DangNhapController.ListLogin)

module.exports = router;