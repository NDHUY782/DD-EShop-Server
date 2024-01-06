const { Schema , model } = require("mongoose")

const CartModel = new Schema({
    product_id:{
        type:String,
        require: true,
    },
    user_id:{
        type:String,
        require: true,
    },
},{
    timestamps : true
})


module.exports = model('carts' , CartModel)