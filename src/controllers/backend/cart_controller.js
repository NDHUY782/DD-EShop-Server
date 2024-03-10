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
const UserModel   = require("../../models/user_model")


//Get cart
const listCart = async(req,res) => {
   try {
    const {
        user_id
    }  = req.params
    
    const cartItem = await CartModel.find({user_id:user_id})
    if (cartItem) {
        res.status(202).send({success: true,msg:'All Cart',data:cartItem})
    } else {
        res.status(400).send({success: false,msg:error.message})
    }
   } catch (error) {
        res.status(400).send({success: false,msg:error.message})
   }
}
//Add to cart
const add_to_cart = async(req,res) =>{
    try {
        const user_id = req.params.user_id
        const userData = await UserModel.findById(user_id)
        const productID = req.params.product_id
        const productData = await ProductModel.findById(productID)
        let product_price
        if (productData) {
            if (productData.sale_price != null) {
                product_price= productData.sale_price
            } else {
                product_price= productData.price
            }
            const quantity = req.body.quantity
            const cartData = await CartModel.findOne({user_id: user_id, product_id: productID})
            if (cartData) {
                if (quantity == null) {
                    await cartData.updateOne({ 
                        $set: {
                            quantity: cartData.quantity + 1
                        }
                })
                } else {
                    await cartData.updateOne({ 
                        $set: {
                            quantity: cartData.quantity + quantity
                        }
                })
                }
                res.status(202).send({success: true,msg:'thành công'})
                // if (cartData.user_id === userData._id && cartData.product_id === productData._id) {
                //     const  sessionUser= userData._id
                //     const  productId = productData._id
                //     await cartData.updateOne({user_id: sessionUser, product_id: productId })
                // } else {
                //     const cart_obj = new CartModel({
                //         product_id   :   productData._id,
                //         user_id      :   userData._id,
                //         product_image:   productData.avatar,
                //         product_price:   product_price,
                //         product_name :   productData.name,
                //     })
                //     cart_obj.save()
                //     res.status(202).send({success: true,msg:'thành công',data:cart_obj})
                //     console.log(req.params.user_id,req.params.product_id,productData)
                // }
            } else {
                const cart_obj = new CartModel({
                    product_id   :   productData._id,
                    user_id      :   userData._id,
                    product_image:   productData.avatar,
                    product_price:   product_price,
                    product_name :   productData.name,
                    quantity     :   req.body.quantity
                })
                cart_obj.save()
                res.status(202).send({success: true,msg:'thành công',data:cart_obj})
                console.log(cart_obj)
            }
        } else {
                res.status(400).send({success: false,msg:error.message})
                // console.log("sai")
        }

    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }

}
const deleteCart = async(req, res) =>{
    try {
        
        await CartModel.deleteOne({ user_id: req.params.user_id,product_id:req.params.product_id })
        res.status(202).send({success: true,msg:'Xóa Thành Công'})
    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}
module.exports = {
    add_to_cart,
    deleteCart,
    listCart
}

