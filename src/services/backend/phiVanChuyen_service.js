const phiVanChuyenModel = require(`${__path_models}phiVanChuyen_model`)
const utilsHelpers  = require(`${__path_helpers}utils`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await phiVanChuyenModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await phiVanChuyenModel
                            .find(obj.condition)
                            .sort(obj.sort)
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)

        return{
            data
        }

    },

    countAll: async (obj) => { // Filter 
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, phiVanChuyenModel)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        phiVanChuyenModel.updateOne({_id: obj.id}, {status: obj.status}, (err,result) => {
        });
        
        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        phiVanChuyenModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    deleteItem: async (obj) => { // Delete one items 
       await phiVanChuyenModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data          = {}

        if(obj.id === ''){ /// add
            pageTitle = 'Add - Form'
        }else { /// edit
            data = await phiVanChuyenModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }

        return {
            pageTitle,
            data
        }
    },

    editItem: async (obj) => { // (edit item)
        await phiVanChuyenModel.updateOne({_id:obj.id}, {
                ordering: obj.ordering,
                status: obj.status,
                name: obj.name,
                price: obj.price,
            });
    },

    addItem: async (obj) => { // (NewData add)
        await new phiVanChuyenModel(obj).save()
    },

    ChangeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount
        await phiVanChuyenModel.deleteMany({_id: {$in: obj.arrId}}).then((result) => {
            deletedCount = result.deletedCount
        });

        return{
            deletedCount
        } 
    },

     ChangeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount
        await phiVanChuyenModel.updateMany({_id: {$in: obj.arrId}}, {status: obj.action}).then((result) =>{
            modifiedCount = result.modifiedCount
        });

        return{
            modifiedCount
        } 
    },


    //---- frondEnd start---//
    show_frontend: async () => {
        let data = await phiVanChuyenModel.find({status: "active"})
        return {
            data
        }
    },

    soTien: async (obj) => {
        let data = await phiVanChuyenModel.findOne({ordering: obj.value})
        return {
            soTien: data.price,
            success: true,
        }
    }
    //---- frondEnd end---//
}
