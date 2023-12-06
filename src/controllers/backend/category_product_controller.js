const routerName = 'category_product';
const renderName = `backend/page/${routerName}/`;
const linkPrefix = `/dhuy782/category_product/`

const {validationResult} = require('express-validator')
const util = require('util')

const paramsHelpers = require(`${__path_helpers}params`)
const notify  		= require(`${__path_configs}notify`)
const SlugHelpers   = require(`${__path_helpers}slug`)
const fileHelpers = require(`${__path_helpers}file`)

const uploadAvatar = fileHelpers.upload('avatar', `${__path_public}uploads/category_products/`)


const CategoryProductService = require(`${__path_services}backend/category_product_service`);

module.exports = {
    getlist : async (req , res , next) => {
        let condition = {}
        let keyword   = paramsHelpers.getParam(req.query, 'keyword', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')
        let sortField = paramsHelpers.getParam(req.session, 'sortField', 'ordering')
        let sortType  = paramsHelpers.getParam(req.session, 'sortType', 'asc')
        let sort = {}

        let pagination = {
            totalItem       : 1,
            totalItemPerPage: 5,
            currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange       : 3
        }

        sort[sortField] = sortType
        
        if (currentStatus === 'all'){
            if(keyword !== '') condition = {name: {$regex: keyword, $options: 'i'}}
        }else {
            condition = {status: currentStatus, name: {$regex: keyword, $options: 'i'}}
        }

        let { data }  = await CategoryProductService.getAll({pagination, condition, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await CategoryProductService.countAll({choosedStatus})

        let pageTitle = 'Category Product'
 
        res.render(`${renderName}list` , {
            items :        data,
            pageTitle,
            currentStatus,
            keyword,
            pagination,
            statusFilter:  statusFilter,
            sortType,
            sortField
        })
    },
    getlist_json : async (req , res , next) => {
        let condition = {}
        let keyword   = paramsHelpers.getParam(req.query, 'keyword', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')
        let sortField = paramsHelpers.getParam(req.session, 'sortField', 'ordering')
        let sortType  = paramsHelpers.getParam(req.session, 'sortType', 'asc')
        let sort = {}

        let pagination = {
            totalItem       : 1,
            totalItemPerPage: 5,
            currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange       : 3
        }

        sort[sortField] = sortType
        
        if (currentStatus === 'all'){
            if(keyword !== '') condition = {name: {$regex: keyword, $options: 'i'}}
        }else {
            condition = {status: currentStatus, name: {$regex: keyword, $options: 'i'}}
        }

        let { data }  = await CategoryProductService.getAll({pagination, condition, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await CategoryProductService.countAll({choosedStatus})

        let pageTitle = 'Category Product'
 
        // res.render(`${renderName}list` , {
        //     items :        data,
        //     pageTitle,
        //     currentStatus,
        //     keyword,
        //     pagination,
        //     statusFilter:  statusFilter,
        //     sortType,
        //     sortField
        // })
        res.json({
            items :        data,
            pageTitle,
            currentStatus,
            keyword,
            pagination,
            statusFilter:  statusFilter,
            sortType,
            sortField
        })
    },

    getForm : async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')

        let { pageTitle, data } = await CategoryProductService.getForm({id})

        res.render(`${renderName}form` , {
            pageTitle,
            items :  data
        });
    },

    getSort: async (req , res , next) => {
        req.session.sortField      = paramsHelpers.getParam(req.params, 'sort_field', 'ordering')
        req.session.sortType       = paramsHelpers.getParam(req.params, 'sort_type', 'asc')
        
        res.redirect(`${linkPrefix}`)
    },

    getStatus: async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'active')
        let status        = (currentStatus === 'active') ? 'inactive' : 'active'

        let data = await CategoryProductService.changeStatus({id, status})
        data.status        = status
        data.id            = id
        data.currentStatus = currentStatus

        res.send(data) 
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

        let {success} = await CategoryProductService.changeNumber({id, data})

        res.send({
            success,
            id,
            number,
            collection
        })
    },

    deleteItem: async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')
        let {avatar}      = await CategoryProductService.findAvatar({id})

        await CategoryProductService.deleteItem({id})

        fileHelpers.remove('src/public/uploads/category_products/', avatar)
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

                if(err.code === 'LIMIT_FILE_SIZE') err = 'Kích thước file ko phù hợp'
                errorArr['avatar'] = [err]

                let { data, pageTitle } = await CategoryProductService.getForm({id})
                
                res.render(`${renderName}form`, {
                    pageTitle,
                    item: data,
                    errorArr,
                });
                return;
            }else{
                if (typeof item !== 'undefined' && item.id !== "") { //edit
                    if(req.files == undefined || req.files.length == 0){
                        item.avatar = item.image_old;
                    } else {
                        item.avatar = req.files[0].filename;
                        fileHelpers.remove('src/public/uploads/category_products/', item.image_old)
                    }
                    await CategoryProductService.editItem(item)

                    req.flash('success', notify.EDIT_SUCCESS)
                    res.redirect(`${linkPrefix}`)
                } 
                else { // add
                    item.avatar = req.files[0].filename
                    item.id_category = item.category
                    item.created = {
                        user_id: 0,
                        user_name: "admin",
                        time: Date.now()
                    }
                    await CategoryProductService.addItem(item)

                    req.flash('success', notify.ADD_SUCCESS)
                    res.redirect(`${linkPrefix}`)
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
                    let {avatar}      = await CategoryProductService.findAvatar({id: id[index]})
                    fileHelpers.remove('src/public/uploads/category_products/', avatar)
                }
            } else {
                let {avatar}          = await CategoryProductService.findAvatar({id})
                fileHelpers.remove('src/public/uploads/category_products/', avatar)
            }
            let {deletedCount}        = await CategoryProductService.ChangeDeleteMultiple({id})
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
            let {modifiedCount}        = await CategoryProductService.ChangeStatusMultiple({id, data})
            req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, modifiedCount))
            res.redirect(`${linkPrefix}`)

        }

    },

}
