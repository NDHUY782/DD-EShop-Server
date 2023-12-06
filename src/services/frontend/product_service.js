
// const CategoryProductModel = require(`${__path_models}category_product_model`)
// const ProductModel = require(`${__path_models}product_model`)


// module.exports = {
//     findOneProduct: async (obj) => {

//         let data_product_detail = await ProductModel.findById({_id: obj.id})

//         return {
//             data_product_detail
//         }
//     },

//     findAllCategoryProduct: async (obj) => {
//         let condition = {
//             status: 'active',
//         }

//         if (obj.fillter !== ''){
//             let arrFliter = obj.fillter.split('-')
//             condition.slug = { $in: arrFliter }
//         }
//         let categoryProductItems = await CategoryProductModel.find(condition, { id: 1, name: 1 })
        
//         return {
//             categoryProductItems
//         }
//     },

//     ListProduct: async (obj) => {
//         let count = await ProductModel.count(obj.condition)
//         obj.pagination.totalItem = count

//         let data_product = await ProductModel
//                             .find(obj.condition)
//                             .sort({ordering : 1})
//                             .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
//                             .limit(obj.pagination.totalItemPerPage)
//         return {
//             data_product
//         }
//     },

// }
