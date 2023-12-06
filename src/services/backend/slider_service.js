const SliderModel = require(`${__path_models}slider_model`)
const CategoryModel = require(`${__path_models}category_model`)
const utilsHelpers = require(`${__path_helpers}utils`)

module.exports = {
    getAll: async (obj) => { // (GetData for LIST, Pagination, Search)

        let count = await SliderModel.count(obj.condition)
        obj.pagination.totalItem = count

        let data = await SliderModel
            .find(obj.condition)
            .select('name avatar status ordering id_category created modified')
            .sort(obj.sort)
            .skip((obj.pagination.currentPage - 1) * obj.pagination.totalItemPerPage)
            .limit(obj.pagination.totalItemPerPage)

        return {
            data
        }

    },

    getListCategory: async () => { //getListCategory for list Slider
        let categoryItems = await CategoryModel.find({status: 'active'}, { id: 1, name: 1 })
        return {
            categoryItems
        }
    },

    countAll: async (obj) => { // Filter
        let statusFilter = utilsHelpers.createFilterStatus(obj.choosedStatus, SliderModel, obj.arrIdCategory)
        return statusFilter
    },

    changeStatus: async (obj) => { // Change status in table

        SliderModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    changeNumber: async (obj) => { // Change ordering in table
        SliderModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true,
        }
    },

    changeCategory: async (obj) => { // Change category in table
        SliderModel.updateOne({ _id: obj.id }, obj.data, (err, result) => {
        });

        return {
            success: true
        }
    },

    deleteItem: async (obj) => { // Delete one items
        await SliderModel.deleteOne({_id: obj.id});
    },

    getForm: async (obj) => {  // (GetData for FORM, edit, add)
        let data = {}

        if (obj.id === '') { /// add
            pageTitle = 'Add - Form'
        } else { /// edit
            data = await SliderModel.findById(obj.id)
            pageTitle = 'Edit - Form'
        }
        return {
            pageTitle,
            data,
        }
    },

    editItem: async (obj) => { // (edit item)
        await SliderModel.updateOne({ _id: obj.id }, {
            ordering: obj.ordering,
            status: obj.status,
            name: obj.name,
            slug: obj.slug,
            content: obj.content,
            short_description: obj.short_description,
            id_category: obj.category,
            avatar: obj.avatar,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now()
            }
        });

        return {
            success: true,
        }
    },

    addItem: async (obj) => { // (NewData add)
        await new SliderModel(obj).save()
    },

    findAvatar: async (obj) => { // (findAvatar by id)
        let avatar
        await SliderModel.findById(obj.id).then((item) => {
            avatar = item.avatar
        })
        return {
            avatar
        }
    },

    changeDeleteMultiple: async (obj) => { // (Delete multiple)
        let deletedCount

        await SliderModel.deleteMany({ _id: { $in: obj.id }}).then(result => {
            deletedCount = result.deletedCount
        })

        return {
            deletedCount
        }
    },

    changeStatusMultiple: async (obj) => { // (Change status multiple)
        let modifiedCount

        await SliderModel.updateMany({ _id: { $in: obj.id } }, obj.data).then(result => {
            modifiedCount = result.modifiedCount
        })

        return {
            modifiedCount
        }
    },

}
