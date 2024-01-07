const express = require('express')

const router = express.Router()
const CartController = require(`${__path_controllers}backend/cart_controller`)

router
    .route('/api')
    .post(CartController.add_to_cart)

    // router.get("/gio-hang", cartController.cart);
    // router.post("/them/gio-hang/:id", cartController.addCart);
    // router.put("/sua/gio-hang/:id", cartController.updateCart);
    // router.delete("/xoa/gio-hang/:id", cartController.deleteCart);
module.exports = router;