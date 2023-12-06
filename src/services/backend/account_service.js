const AuthenModel = require(`${__path_models}authen_model`)
const CategoryAccountModel = require(`${__path_models}category_account_model`)
const utilsHelpers  = require(`${__path_helpers}utils`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await AuthenModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await AuthenModel
                            .find(obj.condition)
                            .sort(obj.sort)
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)

        return{
            data
        }

    },

    getListCategory: async () => { //getListCategory for list article
        let categoryAccounts = await CategoryAccountModel.find({status: 'active'}, { id: 1, name: 1 })
        return {
            categoryAccounts
        }
    },

    countAll: async (obj) => { // Filter 
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, AuthenModel)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        AuthenModel.updateOne({_id: obj.id}, {status: obj.status}, (err,result) => {
        });
        
        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        AuthenModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    changeCategory: async (obj) => { // Change category in table
        AuthenModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true
        }
    },

    deleteItem: async (obj) => { // Delete one items 
       await AuthenModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data          = {}

        if(obj.id === ''){ /// add
            pageTitle = 'Add - Form'
        }else { /// edit
            data = await AuthenModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }

        return {
            pageTitle,
            data
        }
    },

    editItem: async (obj) => { // (edit item)
        await AuthenModel.updateOne({_id:obj.id}, {
                username: obj.username,
                role: obj.role,
                status: obj.status,
                password: obj.password,
                hoten: obj.hoten,
                phone: obj.phone,
                email: obj.email,
            });
    },

    addItem: async (obj) => { // (NewData add)
        await new AuthenModel(obj).save()
    },

    ChangeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount
        await AuthenModel.deleteMany({_id: {$in: obj.arrId}}).then((result) => {
            deletedCount = result.deletedCount
        });

        return{
            deletedCount
        } 
    },

    ChangeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount
        await AuthenModel.updateMany({_id: {$in: obj.arrId}}, {status: obj.action}).then((result) =>{
            modifiedCount = result.modifiedCount
        });

        return{
            modifiedCount
        } 
    },

    findAllUser: async () => {
        let data          = await AuthenModel.find({}).select('_id')
        return {
            data
        }
    },

    findUserName: async (id) => {
        let data = await AuthenModel.findById(id)

        return {
            username: data.hoten,
            email: data.email
        }
    },

    updateLastLogin: async (obj) => { // (update lần đăng nhập gần nhất)
        await AuthenModel.findOneAndUpdate({username:obj.username}, {
            lastDateLogin: obj.lastDateLogin,
        });
    },

//----------front-end Authentication ---------//
    findOne: async (username) => {
        let condition = {
            username: username,
            status: 'active'
        }
        // let data = await AuthenModel.findOne(condition)
        return AuthenModel.findOne(condition)
    },

    findItem: async (id) => {
        return AuthenModel.findById(id)
    },

    show_frontend: async () => {
        let data = await AuthenModel.findOne({status: 'active'})

        return {data}
    }
//----------front-end Authentication ---------//
}
