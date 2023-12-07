const routerName = 'account';
const renderName = `backend/page/${routerName}/`;

const linkPrefix = `/dhuy782/account/`

const util = require('util')

const notify = require(`${__path_configs}notify`)
const paramsHelpers = require(`${__path_helpers}params`)
const {validationResult} = require('express-validator')

const AccountService = require(`${__path_services}backend/account_service`);


module.exports = {
    getlist : async (req , res , next) => {
        let condition = {}
        let keyword   = paramsHelpers.getParam(req.query, 'keyword', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')

        let { categoryAccounts } = await AccountService.getListCategory()
        let categoryAccountsFilter = [...categoryAccounts];
        let arrIdCategory = []
        categoryAccounts.forEach(value => {
            arrIdCategory.push(value.id)
        })

        let sortField = paramsHelpers.getParam(req.session, 'sortField', 'ordering')
        let sortType  = paramsHelpers.getParam(req.session, 'sortType', 'asc')
        let idCategory  = paramsHelpers.getParam(req.session, 'idCategory', '')
        let sort = {}

        categoryAccountsFilter.unshift({ id: 'allvalue', name: 'All Category' })

        let pagination = {
            totalItem       : 1,
            totalItemPerPage: 9,
            currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange       : 3
        }

        sort[sortField] = sortType

        condition.id_category = { $in: arrIdCategory }
        if (idCategory !== '' && idCategory !== 'allvalue') condition.role = idCategory
        if (currentStatus !== 'all') condition.status = currentStatus
        if (keyword !== '') condition.name = { $regex: keyword, $options: 'i' }

        let { data }  = await AccountService.getAll({pagination, condition, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await AccountService.countAll({choosedStatus, arrIdCategory})

        let pageTitle = 'Account'
 
        res.render(`${renderName}list` , {
            items :        data,
            pageTitle,
            currentStatus,
            keyword,
            pagination,
            statusFilter:  statusFilter,
            categoryAccounts,
            categoryAccountsFilter,
            sortType,
            sortField,
            idCategory
        })
    },
    getlist_json : async (req , res , next) => {
        let condition = {}
        let keyword   = paramsHelpers.getParam(req.query, 'keyword', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')

        let { categoryAccounts } = await AccountService.getListCategory()
        let categoryAccountsFilter = [...categoryAccounts];
        let arrIdCategory = []
        categoryAccounts.forEach(value => {
            arrIdCategory.push(value.id)
        })

        let sortField = paramsHelpers.getParam(req.session, 'sortField', 'ordering')
        let sortType  = paramsHelpers.getParam(req.session, 'sortType', 'asc')
        let idCategory  = paramsHelpers.getParam(req.session, 'idCategory', '')
        let sort = {}

        categoryAccountsFilter.unshift({ id: 'allvalue', name: 'All Category' })

        let pagination = {
            totalItem       : 1,
            totalItemPerPage: 99999999999,
            currentPage     : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange       : 3
        }

        sort[sortField] = sortType

        condition.id_category = { $in: arrIdCategory }
        if (idCategory !== '' && idCategory !== 'allvalue') condition.role = idCategory
        if (currentStatus !== 'all') condition.status = currentStatus
        if (keyword !== '') condition.name = { $regex: keyword, $options: 'i' }

        let { data }  = await AccountService.getAll({pagination, condition, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await AccountService.countAll({choosedStatus, arrIdCategory})

        let pageTitle = 'Account'
 
        res.json({
            items :        data,
            // pageTitle,
            // currentStatus,
            // keyword,
            // pagination,
            // statusFilter:  statusFilter,
            // categoryAccounts,
            // categoryAccountsFilter,
            // sortType,
            // sortField,
            // idCategory
        })
    },

    getForm : async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')

        let { categoryAccounts }   = await AccountService.getListCategory()
        let { data, pageTitle } = await AccountService.getForm({id})

        categoryAccounts.unshift({ id: 'novalue', name: 'Choose Category' })

        res.render(`${renderName}form` , {
            pageTitle,
            items :  data,
            categoryAccounts
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

        let data = await AccountService.changeStatus({id, status})
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

        let {success} = await AccountService.changeNumber({id, data})

        res.send({
            success,
            id,
            number,
            collection
        })
    },

    deleteItem: async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')

        await AccountService.deleteItem({id})

        req.flash('warning', notify.DELETE_SUCCESS)           
        res.redirect(`${linkPrefix}`)
    },

    saveItem: async (req, res, next) => {
        req.body = JSON.parse(JSON.stringify(req.body))
        let item = Object.assign(req.body)

        if(typeof item !== 'undefined' && item.id !== ""){ //edit
            AccountService.editItem(item)
            req.flash('success', notify.EDIT_SUCCESS) 
            res.redirect(`${linkPrefix}`)
        }else{ // add
            AccountService.addItem(item)
            req.flash('success', notify.ADD_SUCCESS) 
            res.redirect(`${linkPrefix}`)
        }
    },

    changeMultipleAction: async (req, res, next) => {
        let action = req.body.action
        let arrId  = req.body.cid

        if (action === 'delete') {
            let { deletedCount } = await AccountService.ChangeDeleteMultiple({arrId})
            req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, deletedCount)) 
            res.redirect(`${linkPrefix}`)
        }else{
            let { modifiedCount } = await AccountService.ChangeStatusMultiple({arrId, action})
            req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, modifiedCount)) 
            res.redirect(`${linkPrefix}`)
        }

    },

    getFilterCategory: async (req , res , next) => {
        req.session.idCategory      = paramsHelpers.getParam(req.params, 'id_category', '')
        
        res.redirect(`${linkPrefix}`)
    },

    getCategory: async (req, res, next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let id_category = paramsHelpers.getParam(req.params, 'id_category', 0)

        let data = {
            role: id_category,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now()
            }
        }

        let {success} = await AccountService.changeCategory({id, data})

        res.send({
            success,
            id,
        })
    },

}
