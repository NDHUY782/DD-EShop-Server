const CategoryProductModel = require(`${__path_models}category_product_model`)
const utilsHelpers  = require(`${__path_helpers}utils`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await CategoryProductModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await CategoryProductModel
                            .find(obj.condition)
                            .sort(obj.sort)
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)

        return{
            data
        }

    },

    countAll: async (obj) => { // Filter 
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, CategoryProductModel)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        CategoryProductModel.updateOne({_id: obj.id}, {status: obj.status}, (err,result) => {
        });
        
        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        CategoryProductModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    deleteItem: async (obj) => { // Delete one items 
       await CategoryProductModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data          = {}

        if(obj.id === ''){ /// add
            pageTitle = 'Add - Form'
        }else { /// edit
            data = await CategoryProductModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }

        return {
            pageTitle,
            data
        }
    },

    editItem: async (obj) => { // (edit item)
        await CategoryProductModel.updateOne({_id:obj.id}, {
                ordering: obj.ordering,
                status: obj.status,
                name: obj.name,
                avatar: obj.avatar,
                slug: obj.slug,
                content: obj.content
            });
    },

    addItem: async (obj) => { // (NewData add)
        await new CategoryProductModel(obj).save()
    },

    findAvatar: async (obj) => { // (findAvatar by id)
        let avatar
        await CategoryProductModel.findById(obj.id).then((item) => {
            avatar = item.avatar
        })
        return {
            avatar
        }
    },

    ChangeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount

        await CategoryProductModel.deleteMany({ _id: { $in: obj.id }}).then(result => {
            deletedCount = result.deletedCount
        })

        return {
            deletedCount
        }
    },

     ChangeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount

        await CategoryProductModel.updateMany({ _id: { $in: obj.id } }, obj.data).then(result => {
            modifiedCount = result.modifiedCount
        })

        return {
            modifiedCount
        }
    },

    show_frontend: async () => {
        let data = await CategoryProductModel.find({status: "active"})
        return {
            data
        }
    },

}
