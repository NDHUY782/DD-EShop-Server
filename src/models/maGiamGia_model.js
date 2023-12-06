const { Schema , model } = require("mongoose")

const maGiamGiaModel = new Schema({
    name : {
        type : String,
    },
    status : {
        type : String,
    },
    gioi_han_tien_giam : {
        type : Number,
    },
    loai : {
        type : Boolean,
    },
    sotien: {
        type : Number,
    },
    phamtram: {
        type : Number,
    },
    quantity : {
        type : Number,
    },
    ngaybatdau: {
        type : Date,
    },
    ngayketthuc: {
        type : Date,
    },

}, {
    timestamps : true
}) 


module.exports = model('maGiaGiams' , maGiamGiaModel)