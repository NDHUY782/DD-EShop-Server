const ProductModel = require(`${__path_models}product_model`)
const CategoryProductModel = require(`${__path_models}category_product_model`)
const CategoryModel = require(`${__path_models}category_model`)
const utilsHelpers = require(`${__path_helpers}utils`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await ProductModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await ProductModel
            .find(obj.condition)
            .select('name avatar status price link quantity sale_price arrCheck ordering id_category id_group_category ')
            .sort(obj.sort)
            .skip((obj.pagination.currentPage - 1) * obj.pagination.totalItemPerPage)
            .limit(obj.pagination.totalItemPerPage)

        return {
            data
        }

    },

    getListCategory: async () => { //getListCategory for list article
        let categoryItems = await CategoryProductModel.find({status: 'active'}, { id: 1, name: 1 })
        return {
            categoryItems
        }
    },

    getListProductGroup: async () => { //getListCategory for list product category
        let groupItems = await CategoryModel.find({status: 'active'}, { id: 1, name: 1 })
        return {
            groupItems
        }
    },

    countAll: async (obj) => { // Filter
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, ProductModel, obj.arrIdCategory, obj.arrIdGroup)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        ProductModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        ProductModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    changeCheckbox: async (obj) => { // Change ordering in table
        ProductModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    changeCategory: async (obj) => { // Change category in table
        ProductModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true
        }
    },

    changeGroup: async (obj) => { // Change category in table
        ProductModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true
        }
    },

    deleteItem: async (obj) => { // Delete one items
        await ProductModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data = {}

        if (obj.id === '') { /// add
            pageTitle = 'Add - Form'
        } else { /// edit
            data = await ProductModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }
        return {
            pageTitle,
            data,
        }
    },

    editItem: async (obj) => { // (edit item)
        await ProductModel.updateOne({ _id: obj.id }, {
            name: obj.name,
            status: obj.status,
            slug: obj.slug,
            ordering: obj.ordering,
            quantity: obj.quantity,
            price: obj.price,
            link: obj.link,
            sale_price: obj.sale_price,
            content: obj.content,
            arrCheck: obj.arrCheck,
            avatar: obj.avatar,
            id_category: obj.category,
        });

        return {
            success: true,
        }
    },

    addItem: async (obj) => { // (NewData add)
        await new ProductModel(obj).save()
    },

    findAvatar: async (obj) => { // (findAvatar by id)
        let avatar
        await ProductModel.findById(obj.id).then((item) => {
            avatar = item.avatar
        })
        return {
            avatar
        }
    },

    findArrCheck: async (obj) => { // (findArrCheck by id)
        let arrCheck = []

        await ProductModel.findById(obj.id).then((item) => {
            arrCheck = item.arrCheck
        })

        return {
            arrCheck
        }
    },

    changeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount

        await ProductModel.deleteMany({ _id: { $in: obj.id }}).then(result => {
            deletedCount = result.deletedCount
        })

        return {
            deletedCount
        }
    },

    changeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount

        await ProductModel.updateMany({ _id: { $in: obj.id } }, obj.data).then(result => {
            modifiedCount = result.modifiedCount
        })

        return {
            modifiedCount
        }
    },

}
