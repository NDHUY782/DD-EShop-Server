const express = require('express')

const router = express.Router()
const donHangController = require(`${__path_controllers}backend/donHang_controller`)
const { validate } = require(`${__path_validator}item`);


router
    .route('(/status/:status)?')
    .get(donHangController.getlist)

router
    .route('/form(/:id)?')
    .get(donHangController.getForm)
    .post(donHangController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(donHangController.getStatus)

router
    .route('/change-number/:id/:number/:collection')
    .get(donHangController.getNumber)    

router
    .route('/delete/:id')
    .get(donHangController.deleteItem)
    
router
    .route('/multipleAction')
    .post(donHangController.changeMultipleAction)

router
    .route('/sort/:sort_field/:sort_type')
    .get(donHangController.getSort)





module.exports = router;