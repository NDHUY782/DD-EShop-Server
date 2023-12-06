
const renderName = `frontend/page/`;

const paramsHelpers = require(`${__path_helpers}params`)
const SlugService = require(`${__path_services}frontend/slug_service`);
const catchAsync  = require(`${__path_utils}catchAsync`)

module.exports = {
    ListSlug: catchAsync( async (req , res , next) => {
        let slug            = await paramsHelpers.getParam(req.params, 'slug', '')
        let search          = paramsHelpers.getParam(req.query, 'search', '') 

        if(slug === 'dhuy782') {
            next()
        }
        if(slug === 'favicon.ico'){
            next()
        }

        let { item } =   await SlugService.findOneCategory({slug})
        if (item !== null) {
            let condition = {}

            let pagination = {
                totalItem       : 1,
                totalItemPerPage: 4,
                currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
                pageRange       : 3
            }
    
    
            let { categoryItems } =   await SlugService.findAllCategory()
    
            let arrIdCategory = []
            categoryItems.forEach(value => {
                arrIdCategory.push(value.id)
            })
    
            condition.status = "active"
            condition.id_category = item.id

            let pageTitle = item.name
            
            let { data_blog } =   await SlugService.ListBlog({condition, pagination})
    
            res.render(`${renderName}blog`, {
                data_blog,
                pagination,
                slug,
                pageTitle
            })
        }
        else {
            let { item } =   await SlugService.findOneCategoryProduct({slug})
            if (item !== null) {
                let condition = {}

                let pagination = {
                    totalItem       : 1,
                    totalItemPerPage: 8,
                    currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
                    pageRange       : 3
                }
        
                condition.status = "active"
                condition.id_category = item.id
                
                let { data_product } =   await SlugService.ListProduct({condition, pagination})

                let product = []
                data_product.forEach(value => {
                    let oneProduct = {}
                    oneProduct.id     = value.id
                    oneProduct.name   = value.name
                    oneProduct.avatar = value.avatar
                    oneProduct.price  = value.price
                    product.push(oneProduct)
                })
        
                res.render(`${renderName}product`, {
                    product,
                    pagination,
                    slug,
                    search
                })
            } else {
                res.render(`${renderName}product`, {
                    product,
                    pagination,
                    slug,
                    search
                })
            }
        }
    }),
}