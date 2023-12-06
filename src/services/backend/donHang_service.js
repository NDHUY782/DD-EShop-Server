const donHangModel = require(`${__path_models}donHang_model`)
const utilsHelpers  = require(`${__path_helpers}utils-invoice`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await donHangModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await donHangModel
                            .find(obj.condition)
                            .sort(obj.sort)
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)

        return{
            data
        }

    },

    countAll: async (obj) => { // Filter 
        let statusFilter = utilsHelpers.createFilterStatusInvoice(obj.choosedStatus, donHangModel)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        donHangModel.updateOne({_id: obj.id}, {status: obj.status}, (err,result) => {
        });
        
        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        donHangModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    deleteItem: async (obj) => { // Delete one items 
       await donHangModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data          = {}

        if(obj.id === ''){ /// add
            pageTitle = 'Add - Form'
        }else { /// edit
            data = await donHangModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }

        return {
            pageTitle,
            data
        }
    },

    editItem: async (obj) => { // (edit item)
        await donHangModel.updateOne({_id:obj.id}, {
                ordering: obj.ordering,
                status: obj.status,
                name: obj.name,
                slug: obj.slug,
                content: obj.content
            });
    },

    addItem: async (obj) => { // (NewData add)
        await new donHangModel(obj).save()
    },

    ChangeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount
        await donHangModel.deleteMany({_id: {$in: obj.arrId}}).then((result) => {
            deletedCount = result.deletedCount
        });

        return{
            deletedCount
        } 
    },

     ChangeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount
        await donHangModel.updateMany({_id: {$in: obj.arrId}}, {status: obj.action}).then((result) =>{
            modifiedCount = result.modifiedCount
        });

        return{
            modifiedCount
        } 
    },

    show_frontend: async () => {
        let data = await donHangModel.find({status: "active"})
        return {
            data
        }
    },

}
