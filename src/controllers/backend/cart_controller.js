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
const CartModel = require('../../models/cart_model')

const add_to_cart = async(req,res) =>{
    try {
        const cart_obj = new CartModel({
            product_id :    req.body.product_id,
            user_id    :    req.body.user_id,
        });
        const cartData = await cart_obj.save()
        res.status(202).send({success: true,msg:'Add to Cart ',data:cartData})
    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }

}
module.exports = {
    add_to_cart,
}

