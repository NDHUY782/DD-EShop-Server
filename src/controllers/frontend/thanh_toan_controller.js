
// const renderName = `frontend/page/`;

// const ramdomstring = require('randomstring')

// const paramsHelpers              = require(`${__path_helpers}params`)
// const nodemailerDonHangHelpers   = require(`${__path_helpers}nodemailer_donhang`)
// const notify  		             = require(`${__path_configs}notify`)
// const phiVanChuyenService        = require(`${__path_services}backend/phiVanChuyen_service`);
// const maGiamGiaService           = require(`${__path_services}backend/maGiamGia_service`);
// const donHangService             = require(`${__path_services}backend/donHang_service`);
// const catchAsync                 = require(`${__path_utils}catchAsync`)

// module.exports = {

//     CheckOut: catchAsync( async (req , res , next) => {
//         res.render(`${renderName}check_out`,{
//         }) 
//     }),

//     checkPhiVanChuyen: catchAsync( async (req, res, next) => {
//         let value            = paramsHelpers.getParam(req.params, 'value', '')
//         let { soTien, success } = await phiVanChuyenService.soTien({value})

//         res.send({success, soTien})
//     }),

//     checkMaGiamGia: catchAsync( async (req, res, next) => {
//         let code               = paramsHelpers.getParam(req.params, 'code', '')
//         let { value ,success } = await maGiamGiaService.checkDiscountCode({code})
//         let ngayketthuc = 0
//         let ngaybatdau = 0

//         if(value !== null) {
//             ngayketthuc = (value.ngayketthuc.getTime()+(60*1000*60*60*24))/(60*1000*60*60*24)
//             ngaybatdau = value.ngaybatdau.getTime()/(60*1000*60*60*24)
//         }

//         res.send({ 
//             value ,
//             ngayketthuc,
//             ngaybatdau,
//             success 
//         })
//     }),

//     getAddDonHang: catchAsync( async (req, res, next) => {
//         let item = {}
//         item.idUserName = req.user._id
//         item.diaChi     = req.body.diachi
//         item.sdt        = req.body.sdt
//         item.sanpham    = JSON.parse(req.body.sanpham)
//         item.info       = req.body.info
//         item.NgayDat    = Date.now()
//         item.tongTien   = req.body.tongthanhtoan
//         item.phuongThucThanhToan = req.body.phuongthucthanhtoan
//         item.status     =  "cho-lay-hang"

//         let madonhang        = ramdomstring.generate(5)
//         item.maDonHang  = "KSMDH_" + madonhang

//         await donHangService.addItem(item)
//         nodemailerDonHangHelpers.mail(req.user.email, item.tongTien)

//         req.flash('success', notify.SUCCESS_INVOICE)
//         res.redirect(`/`)
//     }),

//     changeStatusDonHang: catchAsync( async (req, res, next) => {
//         let id            = paramsHelpers.getParam(req.params, 'id', '')
//         let status        = 'da-huy'

//         await donHangService.changeStatus({id, status})
//         req.flash('success',"hủy thành công đơn hàng")
//         res.redirect(`/`)
//     }),

// }