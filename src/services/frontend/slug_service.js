
const ArticleModel = require(`${__path_models}article_model`)
const CategoryModel = require(`${__path_models}category_model`)
const CategoryProductModel = require(`${__path_models}category_product_model`)
const ProductModel = require(`${__path_models}product_model`)

module.exports = {

    findOneCategory: async (obj) => {
        let item = await CategoryModel.findOne({ slug: obj.slug})
        return {
            item
        }
    },

    findOneCategoryProduct: async (obj) => {
        let item = await CategoryProductModel.findOne({ slug: obj.slug})
        return {
            item
        }
    },

    findAllCategory: async () => {
        let categoryItems = await CategoryModel.find({status: 'active'}, { id: 1, name: 1 })
        return {
            categoryItems
        }
    },

    ListBlog: async (obj) => {
        let count = await ArticleModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data_blog = await ArticleModel
                            .find(obj.condition)
                            .sort({ordering : 1})
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)
        return {
            data_blog
        }
    },

    ListProduct: async (obj) => {
        let count = await ProductModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data_product = await ProductModel
                            .find(obj.condition)
                            .sort({ordering : 1})
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)
        return {
            data_product
        }
    },

}
