const routerName = 'cart';

const linkPrefix = `/dhuy782/cart/`

const { validationResult } = require('express-validator');
const { domainToASCII } = require('url');
const util = require('util')

const utilsHelpers = require(`${__path_helpers}utils`)
const paramsHelpers = require(`${__path_helpers}params`)
const SlugHelpers   = require(`${__path_helpers}slug`)
const notify = require(`${__path_configs}notify`)
const fileHelpers = require(`${__path_helpers}file`)
const session = require('express-session');
const CartModel = require('../../models/cart_model')
const ProductModel   = require("../../models/product_model")


//Add to cart
const add_to_cart = async(req,res) =>{
    try {
        const user_id   = req.params.user_id
        const productID = req.params.id
        const productData = await ProductModel.findOne({ product_id: productID})
        if (productData) {
            if (ProductModel.sale_price != null) {
                const cart = new CartModel({
                    product_id: productData._id,
                    product_image: productData.avatar,
                    product_price: productData.sale_price,
                    product_name: productData.name,
                })
                const cartResult = {
                    success  :      true,
                    data     :      cart,
                }
                res.status(200).send(cartResult)
                console.log(cartResult)
            } else {
                const cart = new CartModel({
                    product_id: productData._id,
                    product_image: productData.avatar,
                    product_price: productData.price,
                    product_name: productData.name,
                })
                const cartResult = {
                    success  :      true,
                    data     :      cart,
                }
                res.status(200).send(cartResult)
                console.log(cartResult)
            }

        } else {
            res.status(400).send({success: false,msg:error.message})
        }

    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }

}
module.exports = {
    add_to_cart,
}

