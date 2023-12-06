
const express = require('express')
const router = express.Router()

const loginFrontEndMiddleware = require('../../middleware/login_frontend')

const ThanhToanController = require(`${__path_controllers}frontend/thanh_toan_controller`)

    
router
    .route('/')
    .get( ThanhToanController.CheckOut) 
    // .get(HomeController.CheckOut)

router
    .route('/phiVanChuyen/:value')
    .get(ThanhToanController.checkPhiVanChuyen) 

router
    .route('/maGiamGia/:code')
    .get(ThanhToanController.checkMaGiamGia)
    
router
    .route('/add')
    .post(ThanhToanController.getAddDonHang)

router
    .route('/huydon/:id')
    .get(ThanhToanController.changeStatusDonHang)

module.exports = router;