const CategoryAccountModel = require(`${__path_models}category_account_model`)
const utilsHelpers  = require(`${__path_helpers}utils`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await CategoryAccountModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await CategoryAccountModel
                            .find(obj.condition)
                            .sort(obj.sort)
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)

        return{
            data
        }

    },

    countAll: async (obj) => { // Filter 
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, CategoryAccountModel)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        CategoryAccountModel.updateOne({_id: obj.id}, {status: obj.status}, (err,result) => {
        });
        
        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        CategoryAccountModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    deleteItem: async (obj) => { // Delete one items 
       await CategoryAccountModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data          = {}

        if(obj.id === ''){ /// add
            pageTitle = 'Add - Form'
        }else { /// edit
            data = await CategoryAccountModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }

        return {
            pageTitle,
            data
        }
    },

    editItem: async (obj) => { // (edit item)
        await CategoryAccountModel.updateOne({_id:obj.id}, {
                ordering: obj.ordering,
                status: obj.status,
                name: obj.name,
                slug: obj.slug,
                content: obj.content
            });
    },

    addItem: async (obj) => { // (NewData add)
        await new CategoryAccountModel(obj).save()
    },

    ChangeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount
        await CategoryAccountModel.deleteMany({_id: {$in: obj.arrId}}).then((result) => {
            deletedCount = result.deletedCount
        });

        return{
            deletedCount
        } 
    },

     ChangeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount
        await CategoryAccountModel.updateMany({_id: {$in: obj.arrId}}, {status: obj.action}).then((result) =>{
            modifiedCount = result.modifiedCount
        });

        return{
            modifiedCount
        } 
    },

    findIdAdmin: async (id) => {
        let data = await CategoryAccountModel.findById({_id: id})

        return {
            data
        }
    },

}
