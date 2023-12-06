
// const MenuModel = require(`${__path_models}menu_model`)
// const SliderModel = require(`${__path_models}slider_model`)
// const ArticleModel = require(`${__path_models}article_model`)
// const CategoryModel = require(`${__path_models}category_model`)
// const CategoryProductModel = require(`${__path_models}category_product_model`)
// const ProductModel = require(`${__path_models}product_model`)
// const DonHangModel = require(`${__path_models}donHang_model`)

// module.exports = {
// //--- pageHomeStart ---
//     ListSlider: async () => {
//         let data_slider = await SliderModel.find({status: 'active'}).sort({ordering : 1})

//         return {
//             data_slider
//         }
//     },

//     listProductSpecial: async () => {
//         let condition = {
//             status:  'active',
//             arrCheck: { $in: [ "special" ] },
//         }

//         let data_product_special = await ProductModel.find(condition).sort({ordering : 1}).limit(4)

//         return {
//             data_product_special
//         }
//     },

//     listProductShowHome: async () => {
//         let condition = {
//             status:  'active',
//             arrCheck: { $in: [ "show_home" ] },
//         }

//         let data_product_show_home = await ProductModel.find(condition).sort({ordering : 1}).limit(15)

//         return {
//             data_product_show_home
//         }
//     },

//     listBlogShowHome: async () => {
//         let condition = {
//             status:  'active',
//         }

//         let data_blog_show_home = await ArticleModel.find(condition).sort({ordering : 1}).limit(1)

//         return {
//             data_blog_show_home
//         }
//     },
// //--- pageHomeEnd ---

//     findOneProduct: async (obj) => {

//         let data_product_detail = await ProductModel.findById({_id: obj.id})

//         return {
//             data_product_detail
//         }
//     },


//     Invoice: async (obj) => {
//         let data = await DonHangModel.find(obj)

//         return {
//             data
//         }
//     }
// }
