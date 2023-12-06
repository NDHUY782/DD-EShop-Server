const express = require('express')

const router = express.Router()
const SliderController = require(`${__path_controllers}backend/slider_controller`)
const RssController = require(`${__path_controllers}backend/rss_controller`)

router
    .route('(/status/:status)?')
    .get(SliderController.getlist)

router
    .route('/form(/:id)?')
    .get(SliderController.getForm)
    .post(SliderController.saveItem)

router
    .route('/change-status/:id/:status')
    .get(SliderController.getStatus)

router
    .route('/change-number/:id/:number/:collection')
    .get(SliderController.getNumber)
    
router
    .route('/change-category/:id/:id_category')
    .get(SliderController.getCategory)

router
    .route('/sort/:sort_field/:sort_type')
    .get(SliderController.getSort)
    
router
    .route('/filter-category/:id_category')
    .get(SliderController.getFilterCategory)      

router
    .route('/delete/:id')
    .get(SliderController.deleteItem)
    
router
    .route('/multipleAction')
    .post(SliderController.changeMultipleAction)
 
router
    .route('/rss')
    .get(RssController.getRss)  

module.exports = router;