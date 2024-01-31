const CategoryModel = require(`${__path_models}category_model`)
const utilsHelpers  = require(`${__path_helpers}utils`)
const catchAsync  = require(`${__path_utils}catchAsync`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await CategoryModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await CategoryModel
                            .find(obj.condition)
                            .sort(obj.sort)
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)

        return{
            data
        }

    },

    countAll: async (obj) => { // Filter 
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, CategoryModel)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        CategoryModel.updateOne({_id: obj.id}, {status: obj.status}, (err,result) => {
        });
        
        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        CategoryModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    deleteItem: async (obj) => { // Delete one items 
       await CategoryModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data          = {}

        if(obj.id === ''){ /// add
            pageTitle = 'Add - Form'
        }else { /// edit
            data = await CategoryModel.findById(obj.id)
            // try {
            //     data = await CategoryModel.findById(obj.id)
            //     // pageTitle = 'Edit - Form'
            //   } catch (e) {
            //     console.error("inner", e);
            //   }
            // data = await CategoryModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }

        return {
            pageTitle,
            data
        }
    },

    editItem: async (obj) => { // (edit item)
        await CategoryModel.updateOne({_id:obj.id}, {
                ordering: obj.ordering,
                status: obj.status,
                name: obj.name,
                slug: obj.slug,
                content: obj.content
            });
        return {
            success: true,
        }
    },

    addItem: async (obj) => { // (NewData add)
        await new CategoryModel(obj).save()
    },

    ChangeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount
        await CategoryModel.deleteMany({_id: {$in: obj.arrId}}).then((result) => {
            deletedCount = result.deletedCount
        });

        return{
            deletedCount
        } 
    },

     ChangeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount
        await CategoryModel.updateMany({_id: {$in: obj.arrId}}, {status: obj.action}).then((result) =>{
            modifiedCount = result.modifiedCount
        });

        return{
            modifiedCount
        } 
    },

    show_frontend: async () => {
        let data = await CategoryModel.find({status: "active"})
        return {
            data
        }
    },

}
