const express = require('express')

const router = express.Router()
const maGiamGiaController = require(`${__path_controllers}backend/maGiamGia_controller`)
const { validate } = require(`${__path_validator}item`);


router
    .route('(/status/:status)?')
    .get(maGiamGiaController.getlist)

router
    .route('/form(/:id)?')
    .get(maGiamGiaController.getForm)
    .post(maGiamGiaController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(maGiamGiaController.getStatus)

router
    .route('/change-number/:id/:number/:collection')
    .get(maGiamGiaController.getNumber)    

router
    .route('/delete/:id')
    .get(maGiamGiaController.deleteItem)
    
router
    .route('/multipleAction')
    .post(maGiamGiaController.changeMultipleAction)

router
    .route('/sort/:sort_field/:sort_type')
    .get(maGiamGiaController.getSort)    



module.exports = router;