const express = require('express')

const router = express.Router()
const CartController = require(`${__path_controllers}backend/cart_controller`)

router
    .route('/api')
    .post(CartController.add_to_cart)
module.exports = router;