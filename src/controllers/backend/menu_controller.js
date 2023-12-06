const routerName = 'menu';
const renderName = `backend/page/${routerName}/`;
const linkPrefix = `/dhuy782/menu/`

const MenuModel = require(`${__path_models}menu_model`)

const notify = require(`${__path_configs}notify`)
const paramsHelpers = require(`${__path_helpers}params`)
const utilsHelpers  = require(`${__path_helpers}utils`)
const util = require('util');

const MenuService = require(`${__path_services}backend/menu_service`);


module.exports = {
    getList : async (req , res , next) => {
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

        // Promise.all([])
        let { data }     = await MenuService.getAll({condition, pagination, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await MenuService.countAll({choosedStatus})
        let pageTitle = 'Menu'
 
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

    getForm: async (req , res , next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let { data, pageTitle }  = await MenuService.getForm({id})

        res.render(`${renderName}form` , {
            items : data,
            pageTitle
        })
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

        let {success}     = await MenuService.changeStatus({id, status})

        res.send({
            success,
            id,
            currentStatus,
            status
        }) 
    },

    deleteItem: async (req , res , next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')

        await MenuService.deleteItem({id})
        req.flash('warning', notify.DELETE_SUCCESS)           
        res.redirect(`${linkPrefix}`)
    },

    saveItem: async (req , res , next) => {
        req.body = JSON.parse(JSON.stringify(req.body))
        let item = Object.assign(req.body)

        if (typeof item !== 'undefined' && item.id !== "") { //edit

            await MenuService.editItem(item)

            req.flash('success', notify.EDIT_SUCCESS)
            res.redirect(`${linkPrefix}`)
        } 
        else { //add
            await MenuService.addItem(item)
            req.flash('success', notify.ADD_SUCCESS)
            res.redirect(`${linkPrefix}`)
        }
    },

    changeMultipleAction: async (req, res, next) => {
        let action = req.body.action
        let arrId  = req.body.cid

        if (action === 'delete') {
            let {deletedCount} = await MenuService.changeDeleteMultiple({arrId})

            req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, deletedCount)) 
            res.redirect(`${linkPrefix}`)
        }else{
            let {modifiedCount} = await MenuService.changeStatusMultiple({arrId, action})

            req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, modifiedCount)) 
            res.redirect(`${linkPrefix}`)
        }
    },
}
