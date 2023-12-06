// const routerName = 'home';
// const renderName = `frontend/page/${routerName}`;

// const paramsHelpers = require(`${__path_helpers}params`)
// const nodemailerHelpers   = require(`${__path_helpers}nodemailer`)
// const ContactModel = require(`${__path_models}contact_model`)
// const HomeService = require(`${__path_services}frontend/home_service`);
// const SettingService = require(`${__path_services}backend/setting_service`);
// const catchAsync = require(`${__path_utils}catchAsync`)

// module.exports = {
//     ListHome: catchAsync( async (req , res , next) => {
//         let { data_slider } =   await HomeService.ListSlider()
//         let { data_product_special } =   await HomeService.listProductSpecial()
//         let { data_product_show_home } =   await HomeService.listProductShowHome()
//         let { data_blog_show_home } =   await HomeService.listBlogShowHome()

//         res.render('frontend/page/home' , {
//             data_product_special,
//             data_product_show_home,
//             data_blog_show_home,
//             data_slider
//         })
//     }),

//     ListIntroduce: catchAsync( async (req , res , next) => {

//         res.render('frontend/page/introduce',{

//         })
//     }),

//     ListMembership: catchAsync( async (req , res , next) => {

//         res.render('frontend/page/membership',{

//         })
//     }),

//     ListPolicy: catchAsync( async (req , res , next) => {

//         res.render('frontend/page/policy',{

//         })
//     }),

//     Invoice: catchAsync( async (req , res , next) => {
//         let condition = {}
//         let action            = await paramsHelpers.getParam(req.params, 'action', '')

//         condition.idUserName = req.user._id.toString()
//         if(action !== '') {
//             condition.status = action
//         }

//         let { data }          = await HomeService.Invoice(condition)
//         let donhang = []
//         for (let i = 0; i < data.length; i++) {
//             let sanpham = []
//             let tongtien = 0
//             for (let j = 0; j < data[i].sanpham.length; j++) {
//                 let item = JSON.parse(data[i].sanpham[j])
//                 let id = item.id
//                 let sumOneProduct = Number(item.price) * item.sl
//                 tongtien += sumOneProduct
//                 let { data_product_detail } =   await HomeService.findOneProduct({id})
//                 item.avatar = data_product_detail.avatar[0]
//                 item.name   = data_product_detail.name
//                 item.sumOneProduct = sumOneProduct
//                 sanpham.push(item)
//             }
//             let oneDonHang = {}
//             oneDonHang.id = data[i].id
//             oneDonHang.status = data[i].status
//             oneDonHang.sanpham = sanpham
//             oneDonHang.tongtien = tongtien
//             donhang.push(oneDonHang)
//         }

//         res.render('frontend/page/invoice',{
//             donhang,
//         }) 
//     }),

//     Contact: catchAsync( async (req , res , next) => {
//         req.body = JSON.parse(JSON.stringify(req.body))
//         let item = Object.assign(req.body)

//         let {dataSetting} = await SettingService.show_frontend()

//         await new ContactModel(item).save().then((data) => {
//             nodemailerHelpers.mail(dataSetting, req.body.email, data._id)
//             res.send(data)
//         })
//     }),

// }