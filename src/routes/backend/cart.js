const express = require('express')

const router = express.Router()
const CartController = require('../../controllers/backend/cart_controller')

router
    .route('/api/:user_id')
    .get(CartController.listCart)
router
    .route('/api')
    .post(CartController.add_to_cart)
router
    .route('/api/:user_id/:product_id')
    .post(CartController.add_to_cart)

router
    .route('/api/:user_id/:product_id')
    .delete(CartController.deleteCart)

    // router.get("/gio-hang", cartController.cart);
    // router.post("/them/gio-hang/:id", cartController.addCart);
    // router.put("/sua/gio-hang/:id", cartController.updateCart);
    // router.delete("/xoa/gio-hang/:id", cartController.deleteCart);
module.exports = router;