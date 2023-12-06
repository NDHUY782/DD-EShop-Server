const express = require('express')

const router = express.Router()
const contactController = require(`${__path_controllers}backend/contact_controller`)
const { validate } = require(`${__path_validator}item`);


router
    .route('(/status/:status)?')
    .get(contactController.getlist)

router
    .route('/form(/:id)?')
    .get(contactController.getForm)
    .post(contactController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(contactController.getStatus)

router
    .route('/change-number/:id/:number/:collection')
    .get(contactController.getNumber)    

router
    .route('/delete/:id')
    .get(contactController.deleteItem)
    
router
    .route('/multipleAction')
    .post(contactController.changeMultipleAction)

router
    .route('/sort/:sort_field/:sort_type')
    .get(contactController.getSort)    



module.exports = router;