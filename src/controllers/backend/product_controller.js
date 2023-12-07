const routerName = 'product';
const renderName = `backend/page/${routerName}/`;

const linkPrefix = `/dhuy782/product/`

const { validationResult } = require('express-validator');
const { domainToASCII } = require('url');
const util = require('util')

const utilsHelpers = require(`${__path_helpers}utils`)
const paramsHelpers = require(`${__path_helpers}params`)
const SlugHelpers   = require(`${__path_helpers}slug`)
const notify = require(`${__path_configs}notify`)
const fileHelpers = require(`${__path_helpers}file`)

const uploadAvatar = fileHelpers.upload('avatar', `${__path_public}uploads/products/`)

const ProductService = require(`${__path_services}backend/product_service`);

module.exports = {
    getlist : async (req , res , next) => {
        let condition = {}
        let keyword = paramsHelpers.getParam(req.query, 'keyword', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')

        let { categoryItems } = await ProductService.getListCategory()
        let categoryItemsFilter = [...categoryItems];
        let arrIdCategory = []
        categoryItems.forEach(value => {
            arrIdCategory.push(value.id)
        })
        let { groupItems }          = await ProductService.getListProductGroup()
        let GroupItemsFilter = [...groupItems];
        let arrIdGroup = []
        groupItems.forEach(value => {
            arrIdGroup.push(value.id)
        })

        let sortField   = paramsHelpers.getParam(req.session, 'sortField', 'ordering')
        let sortType    = paramsHelpers.getParam(req.session, 'sortType', 'asc')
        let idCategory  = paramsHelpers.getParam(req.session, 'idCategory', '')
        let idGroup     = paramsHelpers.getParam(req.session, 'idGroup', '')
        let sort = {}

        categoryItemsFilter.unshift({ id: 'allvalue', name: 'All Category' })
        GroupItemsFilter.unshift({ id: 'allvalue', name: 'All Group' })

        let pagination = {
            totalItem: 1,
            totalItemPerPage: 9,
            currentPage: parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange: 999
        }
        sort[sortField] = sortType

        condition.id_category = { $in: arrIdCategory }
        condition.id_group_category = { $in: arrIdGroup }
        if (idCategory !== '' && idCategory !== 'allvalue') condition.id_category = idCategory
        if (idGroup !== '' && idGroup !== 'allvalue')       condition.id_group_category = idGroup
        if (currentStatus !== 'all') condition.status = currentStatus
        if (keyword !== '') condition.name = { $regex: keyword, $options: 'i' }

        let { data }  = await ProductService.getAll({condition, pagination, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await ProductService.countAll({choosedStatus, arrIdCategory, arrIdGroup})

        let pageTitle = 'Product'
 
        res.render(`${renderName}list` , {
            items :        data,
            pageTitle,
            currentStatus,
            keyword,
            pagination,
            statusFilter:  statusFilter,
            categoryItems,
            groupItems,
            categoryItemsFilter,
            GroupItemsFilter,
            sortType,
            sortField,
            idCategory,
            idGroup
        })
    },
    getlist_json : async (req , res , next) => {
        let condition = {}
        let keyword = paramsHelpers.getParam(req.query, 'keyword', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')

        let { categoryItems } = await ProductService.getListCategory()
        let categoryItemsFilter = [...categoryItems];
        let arrIdCategory = []
        categoryItems.forEach(value => {
            arrIdCategory.push(value.id)
        })
        let { groupItems }          = await ProductService.getListProductGroup()
        let GroupItemsFilter = [...groupItems];
        let arrIdGroup = []
        groupItems.forEach(value => {
            arrIdGroup.push(value.id)
        })

        let sortField   = paramsHelpers.getParam(req.session, 'sortField', 'ordering')
        let sortType    = paramsHelpers.getParam(req.session, 'sortType', 'asc')
        let idCategory  = paramsHelpers.getParam(req.session, 'idCategory', '')
        let idGroup     = paramsHelpers.getParam(req.session, 'idGroup', '')
        let sort = {}

        categoryItemsFilter.unshift({ id: 'allvalue', name: 'All Category' })
        GroupItemsFilter.unshift({ id: 'allvalue', name: 'All Group' })

        let pagination = {
            totalItem: 1,
            totalItemPerPage: 999999999999999999,
            currentPage: parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange: 999
        }
        sort[sortField] = sortType

        condition.id_category = { $in: arrIdCategory }
        condition.id_group_category = { $in: arrIdGroup }
        if (idCategory !== '' && idCategory !== 'allvalue') condition.id_category = idCategory
        if (idGroup !== '' && idGroup !== 'allvalue')       condition.id_group_category = idGroup
        if (currentStatus !== 'all') condition.status = currentStatus
        if (keyword !== '') condition.name = { $regex: keyword, $options: 'i' }

        let { data }  = await ProductService.getAll({condition, pagination, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await ProductService.countAll({choosedStatus, arrIdCategory, arrIdGroup})

        let pageTitle = 'Product'
 
    //     // res.render(`${renderName}list` , {
    //     //     items :        data,
    //     //     pageTitle,
    //     //     currentStatus,
    //     //     keyword,
    //     //     pagination,
    //     //     statusFilter:  statusFilter,
    //     //     categoryItems,
    //     //     groupItems,
    //     //     categoryItemsFilter,
    //     //     GroupItemsFilter,
    //     //     sortType,
    //     //     sortField,
    //     //     idCategory,
    //     //     idGroup
    //     // })
        res.json({
            items :        data,
            pageTitle,
            currentStatus,
            keyword,
            pagination,
            statusFilter:  statusFilter,
            categoryItems,
            groupItems,
            categoryItemsFilter,
            GroupItemsFilter,
            sortType,
            sortField,
            idCategory,
            idGroup
        })
    },

    getForm : async (req , res , next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')

        let { categoryItems }          = await ProductService.getListCategory()
        let { groupItems }          = await ProductService.getListProductGroup()
        let { data, pageTitle }        = await ProductService.getForm({id})

        categoryItems.unshift({ id: 'novalue', name: 'Choose Category Product' })
        groupItems.unshift({ id: 'novalue', name: 'Choose Group Product' })

        res.render(`${renderName}form` , {
            pageTitle,
            items :  data,
            categoryItems,
            groupItems
        });
        // res.json({
        //     items :  data,
        //     categoryItems,
        //     groupItems
        // })
    },

    getStatus: async (req , res , next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'active')
        let status = (currentStatus === 'active') ? 'inactive' : 'active'
        let data = {
            status: status,
        }

        let { success } = await ProductService.changeStatus({id, data})

        res.send({
            success,
            id,
            currentStatus,
            status
        })

    },

    getCheckbox: async (req , res , next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let checkbox = paramsHelpers.getParam(req.params, 'checkbox', '')

        let { arrCheck } = await ProductService.findArrCheck({id})
        let newArrCheck

        if (arrCheck.includes(checkbox)){
            newArrCheck = arrCheck.filter(item => item !== checkbox)
        }
        else {
            arrCheck.push(checkbox)
            newArrCheck = [...arrCheck]

        }

        let data = {
            arrCheck: newArrCheck,
        }

        let { success } = await ProductService.changeCheckbox({id, data})

        res.send({
            success,
        })

    },

    getNumber: async (req, res, next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let number = paramsHelpers.getParam(req.params, 'number', 0)
        number < 0 ? number = 0 : number
        let collection = paramsHelpers.getParam(req.params, 'collection', 0)
        let data = {}

        if (collection === 'Quantity') {
            data.quantity = number
        }
        else if (collection === 'Ordering') {
            data.ordering = number
        }
        else if (collection === 'Price') {
            data.price = number
        }
        else if (collection === 'Discount') {
            number > 100 ? number = 100 : number
            data.discount = number
        }

        let {success} = await ProductService.changeNumber({id, data})

        res.send({
            success,
            id,
            number,
            collection
        })
    },

    getCategory: async (req, res, next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let id_category = paramsHelpers.getParam(req.params, 'id_category', 0)
        let data = {
            id_category: id_category,
        }

        let {success} = await ProductService.changeCategory({id, data})
        let name = "category"

        res.send({
            success,
            name
        })
    },

    getGroup: async (req, res, next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let id_group_category = paramsHelpers.getParam(req.params, 'id_group', 0)
        let data = {
            id_group_category: id_group_category,
        }

        let {success} = await ProductService.changeGroup({id, data})
        let name = "group"
        res.send({
            success,
            name
        })
    },

    deleteItem: async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')
        let {avatar}      = await ProductService.findAvatar({id})

        await ProductService.deleteItem({id})

        avatar.forEach(item => {
            fileHelpers.remove('src/public/uploads/products/', item)
        })

        req.flash('warning', notify.DELETE_SUCCESS)           
        res.redirect(`${linkPrefix}`)
    },

    saveItem: async (req, res, next) => {
        uploadAvatar(req, res, async (err) => {
            req.body = JSON.parse(JSON.stringify(req.body))
            let item = Object.assign(req.body)


            let slug = SlugHelpers.slug(item.name)
            item.slug = slug
  
            if (err) {
                let errorArr = {}

                let { categoryItems }   = await ProductService.getListCategory()
                categoryItems.unshift({ id: 'novalue', name: 'Choose Category' })

                if(err.code === 'LIMIT_FILE_SIZE') err = 'Kích thước file ko phù hợp'
                errorArr['avatar'] = [err]

                let { data, pageTitle } = await ProductService.getForm({id})
                
                res.render(`${renderName}form`, {
                    pageTitle,
                    item: data,
                    errorArr,
                    categoryItems
                });
                // res.json({
                //     item : data,
                // })
                return;
            }else{
                if (typeof item !== 'undefined' && item.id !== "") { //edit
                    item.avatar = item.arrAvatar.split(',')
                    if(item.remove_image_old !== ''){
                        arrAvatar = item.arrAvatar.replace(item.remove_image_old, '')
                        let avatarRemove = item.remove_image_old.split(',')
                        avatarRemove.forEach(img => {
                            fileHelpers.remove('src/public/uploads/products/',img)
                            item.avatar = item.avatar.filter(item => item !== img)
                        })
                    }

                    if (Object.keys(req.files).length > 0){
                        req.files.forEach((results) => {
                            item.avatar.push(results.filename)
                        })
                    }

                    await ProductService.editItem(item)

                    req.flash('success', notify.EDIT_SUCCESS)
                    res.redirect(`${linkPrefix}`)
                    // res.json({
                    //     notice: 'success'
                    // })
                } 
                else { // add
                    item.avatar = []
                    req.files.forEach((results) => {
                        item.avatar.push(results.filename)
                    })

                    item.id_category       = item.category
                    item.id_group_category = item.group
                    await ProductService.addItem(item)

                    req.flash('success', notify.ADD_SUCCESS)
                    res.redirect(`${linkPrefix}`)
                    // res.json({
                    //     notice: 'success'
                    // })
                }
            }
        })
    },

    changeMultipleAction: async (req, res, next) => {
        let action = req.body.action
        let id     = req.body.cid

        if (action === 'delete') {

            if(Array.isArray(id)){
                for (let index = 0; index < id.length; index++) {
                    let {avatar}      = await ProductService.findAvatar({id: id[index]})
                    avatar.forEach(item => {
                        fileHelpers.remove('src/public/uploads/products/', item)
                    })
                }
            } else {
                let {avatar}          = await ProductService.findAvatar({id})
                avatar.forEach(item => {
                    fileHelpers.remove('src/public/uploads/products/', item)
                })
            }
            let {deletedCount}        = await ProductService.changeDeleteMultiple({id})
            req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, deletedCount))
            res.redirect(`${linkPrefix}`)

        } else {

            let data = {
                status: req.body.action,
                modified: {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now()
                }
            }
            let {modifiedCount}        = await ProductService.changeStatusMultiple({id, data})
            req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, modifiedCount))
            res.redirect(`${linkPrefix}`)

        }
    },

    getSort: async (req , res , next) => {
        req.session.sortField      = paramsHelpers.getParam(req.params, 'sort_field', 'ordering')
        req.session.sortType       = paramsHelpers.getParam(req.params, 'sort_type', 'asc')
        
        res.redirect(`${linkPrefix}`)
    }, 

    getFilterCategory: async (req , res , next) => {
        req.session.idCategory      = paramsHelpers.getParam(req.params, 'id_category', '')
        
        res.redirect(`${linkPrefix}`)
    },

    getFilterGroup: async (req , res , next) => {
        req.session.idGroup      = paramsHelpers.getParam(req.params, 'id_group', '')
        
        res.redirect(`${linkPrefix}`)
    },

    uploadAvatar: async (req , res , next) => {
    },
}
