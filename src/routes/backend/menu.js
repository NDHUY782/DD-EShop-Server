const express = require('express')

const router = express.Router()
const MenuController = require(`${__path_controllers}backend/menu_controller`)
 
router
    .route('(/status/:status)?')
    .get(MenuController.getList) 
    
router
    .route('/form(/:id)?')
    .get(MenuController.getForm)
    .post(MenuController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(MenuController.getStatus)   
    
router
    .route('/delete/:id')
    .get(MenuController.deleteItem)

router
    .route('/multipleAction')
    .post(MenuController.changeMultipleAction)
    
router
    .route('/sort/:sort_field/:sort_type')
    .get(MenuController.getSort)      

module.exports = router;