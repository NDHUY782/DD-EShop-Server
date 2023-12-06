
// const renderName = `frontend/page/`;

// const paramsHelpers = require(`${__path_helpers}params`)
// const BlogService = require(`${__path_services}frontend/blog_service`);
// const catchAsync  = require(`${__path_utils}catchAsync`)


// module.exports = {
//     ListBlog: catchAsync( async (req , res , next) => {
//         let condition = {}

//         let pagination = {
//             totalItem       : 1,
//             totalItemPerPage: 4,
//             currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
//             pageRange       : 3
//         }


//         let { categoryItems } =   await BlogService.findAllCategory()

//         let arrIdCategory = []
//         categoryItems.forEach(value => {
//             arrIdCategory.push(value.id)
//         })

//         condition.status = "active"
//         condition.id_category = { $in: arrIdCategory }
        
//         let pageTitle = ''
        
//         let { data_blog } =   await BlogService.ListBlog({condition, pagination})
//         let slug = ''

//         res.render(`${renderName}blog`, {
//             data_blog,
//             pagination,
//             slug,
//             pageTitle
//         })
//     }),

//     ListBlogDetail: catchAsync( async (req , res , next) => {
//         let slug            = paramsHelpers.getParam(req.params, 'slug', '')

//         let { data_blog_detail } =   await BlogService.ListBlogDetail({slug})
//         let idGroup = data_blog_detail.id_category

//         let { data_product_group } =   await BlogService.listProductGroup({idGroup})
        
//         res.render(`${renderName}blog_detail`,{
//             data_blog_detail,
//             data_product_group
//         })
//     }),
// }