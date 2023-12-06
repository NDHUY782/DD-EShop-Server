
// const ArticleModel = require(`${__path_models}article_model`)
// const CategoryModel = require(`${__path_models}category_model`)
// const ProductModel = require(`${__path_models}product_model`)

// module.exports = {

//     findAllCategory: async () => {
//         let categoryItems = await CategoryModel.find({status: 'active'}, { id: 1, name: 1 })
//         return {
//             categoryItems
//         }
//     },

//     ListBlog: async (obj) => {
//         let count = await ArticleModel.count(obj.condition)
//         obj.pagination.totalItem = count

//         let data_blog = await ArticleModel
//                             .find(obj.condition)
//                             .sort({ordering : 1})
//                             .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
//                             .limit(obj.pagination.totalItemPerPage)
//         return {
//             data_blog
//         }
//     },

//     ListBlogDetail: async (obj) => {
//         data_blog_detail    = await ArticleModel.findOne({ slug: obj.slug })

//         return {
//             data_blog_detail,
//         }
//     },

//     listProductGroup: async (obj) => {
//         let condition = {
//             status:  'active',
//             id_group_category: obj.idGroup,
//         }

//         let data_product_group = await ProductModel.find(condition).sort({ordering : 1}).limit(8)

//         return {
//             data_product_group,
//         }
//     },
// }
