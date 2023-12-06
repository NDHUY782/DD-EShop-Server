const maGiamGiaModel = require(`${__path_models}maGiamGia_model`)
const utilsHelpers  = require(`${__path_helpers}utils`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await maGiamGiaModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await maGiamGiaModel
                            .find(obj.condition)
                            .sort(obj.sort)
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)

        return{
            data
        }

    },

    countAll: async (obj) => { // Filter 
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, maGiamGiaModel)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        maGiamGiaModel.updateOne({_id: obj.id}, {status: obj.status}, (err,result) => {
        });
        
        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        maGiamGiaModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    deleteItem: async (obj) => { // Delete one items 
       await maGiamGiaModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data          = {}

        if(obj.id === ''){ /// add
            pageTitle = 'Add - Form'
        }else { /// edit
            data = await maGiamGiaModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }

        return {
            pageTitle,
            data
        }
    },

    editItem: async (obj) => { // (edit item)
        await maGiamGiaModel.updateOne({_id:obj.id}, {
                name: obj.name,
                gioi_han_tien_giam: obj.gioi_han_tien_giam,
                loai: obj.loai,
                phamtram: obj.phamtram,
                sotien: obj.sotien,
                quantity: obj.quantity,
                ngaybatdau: obj.ngaybatdau,
                ngayketthuc: obj.ngayketthuc,
                status: obj.status,
            });
    },

    addItem: async (obj) => { // (NewData add)
        await new maGiamGiaModel(obj).save()
    },

    ChangeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount
        await maGiamGiaModel.deleteMany({_id: {$in: obj.arrId}}).then((result) => {
            deletedCount = result.deletedCount
        });

        return{
            deletedCount
        } 
    },

     ChangeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount
        await maGiamGiaModel.updateMany({_id: {$in: obj.arrId}}, {status: obj.action}).then((result) =>{
            modifiedCount = result.modifiedCount
        });

        return{
            modifiedCount
        } 
    },
    //----frontend start ----//
    show_frontend: async () => {
        let data = await maGiamGiaModel.find({status: "active"})
        return {
            data
        }
    },

    checkDiscountCode: async (obj) => {
        let data = await maGiamGiaModel.findOne({name: obj.code, quantity: {$gte:1}, status: "active"})
        let success = true
        if (data === null) success = false
        return {
            value: data,
            success,
        }
    },
    //----frontend end ----//
}
