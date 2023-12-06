const { Schema , model } = require("mongoose")

const donHangModel = new Schema({
    idUserName : {
        type : String,
    },
    maDonHang: {
        type : String,
    },
    diaChi : {
        type : String,
    },
    sdt : {
        type : String,
    },
    sanpham : [
        String,
    ],
    info : {
        type : String,
    },
    phuongThucThanhToan: {
        type : String,
    },
    NgayDat : {
        type : Date,
    },
    tongTien : {
        type : Number,
    },
    status: {
        type : String,
    },
}, {
    timestamps : true
}) 


module.exports = model('donHangs' , donHangModel)