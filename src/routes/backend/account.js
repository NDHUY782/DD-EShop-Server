const express = require('express')
const router = express.Router()

const AccountController = require(`${__path_controllers}backend/account_controller`)

router
    .route('/api')
    .get(AccountController.getlist_json)

router
    .route('/')
    .get(AccountController.getlist)

router
    .route('/form(/:id)?')
    .get(AccountController.getForm)
    .post(AccountController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(AccountController.getStatus)

router
    .route('/change-number/:id/:number/:collection')
    .get(AccountController.getNumber)  
    
router
    .route('/change-category/:id/:id_category')
    .get(AccountController.getCategory)

router
    .route('/filter-category/:id_category')
    .get(AccountController.getFilterCategory)

router
    .route('/delete/:id')
    .get(AccountController.deleteItem)
    
router
    .route('/multipleAction')
    .post(AccountController.changeMultipleAction)

router
    .route('/sort/:sort_field/:sort_type')
    .get(AccountController.getSort)  

module.exports = router;