
const express = require('express')
const router = express.Router()

const ProductController = require(`${__path_controllers}frontend/product_controller`)


router
    .route('/')
    .get(ProductController.ListProduct)

router
    .route('/:id')
    .get(ProductController.ListProductDetail)   

module.exports = router;