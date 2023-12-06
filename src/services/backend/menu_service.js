
const MenuModel = require(`${__path_models}menu_model`)
const utilsHelpers  = require(`${__path_helpers}utils`)

const notify = require(`${__path_configs}notify`)
const paramsHelpers = require(`${__path_helpers}params`)
const util = require('util');
const { Z_BLOCK } = require('zlib');
const routerName = 'menu';
const renderName = `backend/page/${routerName}/`;


module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)
        let count = await MenuModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await MenuModel
                            .find(obj.condition)
                            .sort(obj.sort)
                            .skip((obj.pagination.currentPage-1) * obj.pagination.totalItemPerPage)
                            .limit(obj.pagination.totalItemPerPage)
        return {
            data
        }
    },

    countAll: async (obj) => { // Filter 
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, MenuModel)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        await MenuModel.updateOne({_id: obj.id}, {status: obj.status});
        
        return {
            success: true,
        }
    },

    deleteItem: async (obj) => { // Delete one items 
        await MenuModel.deleteOne({_id: obj.id});
    },
    
    getForm: async (obj) => {
        let data = {}

        if (obj.id === '') { /// add
            pageTitle = 'Add - Form'
        } else { /// edit
            data = await MenuModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }

        return {
            pageTitle,
            data
        }
    },

    editItem: async (obj) => { // (Edit item)
        await MenuModel.updateOne({ _id: obj.id }, {
                name: obj.name,
                status: obj.status,
                parent: obj.parent,
                link  : obj.link,
            });
    },

    addItem: async (obj) => { // (NewData add)
        await new MenuModel(obj).save()
    },

    changeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount
        await MenuModel.deleteMany({_id: {$in: obj.arrId}}).then((result) => {
            deletedCount = result.deletedCount
        });

        return{
            deletedCount
        } 
     },

     changeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount
        await MenuModel.updateMany({_id: {$in: obj.arrId}}, {status: obj.action}).then((result) =>{
            modifiedCount = result.modifiedCount
        });

        return{
            modifiedCount
        } 
     },

    show_frontend: async () => {
        let data = await MenuModel.find({status: "active"})
        return {
            data
        }
    },
}
