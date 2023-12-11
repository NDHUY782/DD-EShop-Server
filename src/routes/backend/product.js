const express = require('express')

const router = express.Router()
const ProductController = require(`${__path_controllers}backend/product_controller`)

router
    .route('(/status/:status)?')
    .get(ProductController.getlist)

router
    .route('/form(/:id)?')
    .get(ProductController.getForm)
    .get(ProductController.getlist)
    .post(ProductController.saveItem)

router
    .route('/api')
    .get(ProductController.getlist_json)

router
    .route('/api/:id')
    .get(ProductController.ListProductDetail)

router
    .route('/change-status/:id/:status')
    .get(ProductController.getStatus)

router
    .route('/change-checkbox/:id/:checkbox')
    .get(ProductController.getCheckbox)

router
    .route('/change-number/:id/:number/:collection')
    .get(ProductController.getNumber)
    
router
    .route('/change-category/:id/:id_category')
    .get(ProductController.getCategory)

router
    .route('/change-group/:id/:id_group')
    .get(ProductController.getGroup)

router
    .route('/sort/:sort_field/:sort_type')
    .get(ProductController.getSort)
    
router
    .route('/filter-category/:id_category')
    .get(ProductController.getFilterCategory)
    
router
    .route('/filter-group/:id_group')
    .get(ProductController.getFilterGroup)  

router
    .route('/delete/:id')
    .get(ProductController.deleteItem)
    
router
    .route('/multipleAction')
    .post(ProductController.changeMultipleAction)
    
router
    .route('/upload')
    .post(ProductController.uploadAvatar)        

module.exports = router;