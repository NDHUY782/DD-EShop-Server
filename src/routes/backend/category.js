const express = require('express')

const router = express.Router()
const categoryController = require(`${__path_controllers}backend/category_controller`)
const { validate } = require(`${__path_validator}item`);


router
    .route('(/status/:status)?')
    .get(categoryController.getlist)

router
    .route('/form(/:id)?')
    .get(categoryController.getForm)
    .post(categoryController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(categoryController.getStatus)

router
    .route('/change-number/:id/:number/:collection')
    .get(categoryController.getNumber)    

router
    .route('/delete/:id')
    .get(categoryController.deleteItem)
    
router
    .route('/multipleAction')
    .post(categoryController.changeMultipleAction)

router
    .route('/sort/:sort_field/:sort_type')
    .get(categoryController.getSort)    



module.exports = router;