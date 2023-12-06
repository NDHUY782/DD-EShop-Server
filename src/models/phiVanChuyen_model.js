const { Schema , model } = require("mongoose")

const phiVanChuyenModel = new Schema({
    name : {
        type : String,
    },
    status : {
        type : String,
    },
    slug : {
        type : String,
    },
    ordering : {
        type : Number,
    },
    price : {
        type : Number,
    },
}, {
    timestamps : true
}) 


module.exports = model('phiVanChuyens' , phiVanChuyenModel)