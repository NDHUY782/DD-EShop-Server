
// const renderName = `frontend/page/`;

// const paramsHelpers = require(`${__path_helpers}params`)
// const ProductService = require(`${__path_services}frontend/product_service`);
// const catchAsync  = require(`${__path_utils}catchAsync`)

// module.exports = {
//     ListProduct: catchAsync( async (req , res , next) => {

//         let fillter  = paramsHelpers.getParam(req.params, 'filter', '')

//         let search   = paramsHelpers.getParam(req.query, 'search', '')

//         let condition = {}
//         if(search !== '') condition = {name: {$regex: search, $options: 'i'}}

//         let pagination = {
//             totalItem       : 1,
//             totalItemPerPage: 16,
//             currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
//             pageRange       : 3
//         }


//         let { categoryProductItems } =   await ProductService.findAllCategoryProduct({fillter})

//         let arrIdCategory = []
//         categoryProductItems.forEach(value => {
//             arrIdCategory.push(value.id)
//         })

//         condition.status = "active"
//         condition.id_category = { $in: arrIdCategory }

//         let { data_product } =   await ProductService.ListProduct({condition, pagination})

//         let product = []

//         data_product.forEach(value => {
//             let oneProduct = {}
//             oneProduct.id     = value.id
//             oneProduct.id_category = value.id_category
//             oneProduct.name   = value.name
//             oneProduct.avatar = value.avatar
//             oneProduct.price  = value.price
//             product.push(oneProduct)
//         })
   
//         let slug = fillter


//         res.render(`${renderName}product`, {
//             product,
//             pagination,
//             slug,
//             search
//         })
        
//     }),

//     ListProductDetail: catchAsync( async (req , res , next) => {
//         let id            = await paramsHelpers.getParam(req.params, 'id', '')

//         let { data_product_detail } =   await ProductService.findOneProduct({id})

//         res.render(`${renderName}view_product`,{
//             data: data_product_detail
//         })
//     }),
// }