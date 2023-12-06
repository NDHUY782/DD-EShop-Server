const express = require('express')

const router = express.Router()
const categoryAccountController = require(`${__path_controllers}backend/category_account_controller`)
const { validate } = require(`${__path_validator}item`);


router
    .route('(/status/:status)?')
    .get(categoryAccountController.getlist)

router
    .route('/form(/:id)?')
    .get(categoryAccountController.getForm)
    .post(categoryAccountController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(categoryAccountController.getStatus)

router
    .route('/change-number/:id/:number/:collection')
    .get(categoryAccountController.getNumber)    

router
    .route('/delete/:id')
    .get(categoryAccountController.deleteItem)
    
router
    .route('/multipleAction')
    .post(categoryAccountController.changeMultipleAction)

router
    .route('/sort/:sort_field/:sort_type')
    .get(categoryAccountController.getSort)    



module.exports = router;