const express = require('express')

const router = express.Router()
const categoryProductController = require(`${__path_controllers}backend/category_product_controller`)
const { validate } = require(`${__path_validator}item`);

router
    .route('/api')
    .get(categoryProductController.getlist_json)

router
    .route('(/status/:status)?')
    .get(categoryProductController.getlist)

router
    .route('/form(/:id)?')
    .get(categoryProductController.getForm)
    .post(categoryProductController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(categoryProductController.getStatus)

router
    .route('/change-number/:id/:number/:collection')
    .get(categoryProductController.getNumber)    

router
    .route('/delete/:id')
    .get(categoryProductController.deleteItem)
    
router
    .route('/multipleAction')
    .post(categoryProductController.changeMultipleAction)

router
    .route('/sort/:sort_field/:sort_type')
    .get(categoryProductController.getSort)    



module.exports = router;