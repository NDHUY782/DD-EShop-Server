const routerName = 'contact';
const renderName = `backend/page/${routerName}/`;

const linkPrefix = `/dhuy782/contact/`

const util = require('util')

const paramsHelpers = require(`${__path_helpers}params`)
const notify  		= require(`${__path_configs}notify`)
const SlugHelpers   = require(`${__path_helpers}slug`)
const {validationResult} = require('express-validator')

const ContactModel = require(`${__path_models}contact_model`)
const nodemailer =  require('nodemailer');

const contactService = require(`${__path_services}backend/contact_service`);

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

        let { data }  = await contactService.getAll({pagination, condition, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await contactService.countAll({choosedStatus})

        let pageTitle = 'Contact'
 
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

    getForm : async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')

        let { pageTitle, data } = await contactService.getForm({id})

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

        let data = await contactService.changeStatus({id, status})
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

        let {success} = await contactService.changeNumber({id, data})

        res.send({
            success,
            id,
            number,
            collection
        })
    },

    deleteItem: async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')

        await contactService.deleteItem({id})

        req.flash('warning', notify.DELETE_SUCCESS, false)           
        res.redirect(`${linkPrefix}`)
    },

    saveItem: async (req, res, next) => {
        req.body = JSON.parse(JSON.stringify(req.body))
        let item = Object.assign(req.body)

        let slug = SlugHelpers.slug(item.name)
        item.slug = slug

        if(typeof item !== 'undefined' && item.id !== ""){ //edit
            contactService.editItem(item)
            req.flash('success', notify.EDIT_SUCCESS, false) 
            res.redirect(`${linkPrefix}`)
        }else{ // add
            contactService.addItem(item)
            req.flash('success', notify.ADD_SUCCESS, false) 
            res.redirect(`${linkPrefix}`)
        }
    },

    changeMultipleAction: async (req, res, next) => {
        let action = req.body.action
        let arrId  = req.body.cid

        if (action === 'delete') {
            let { deletedCount } = await contactService.ChangeDeleteMultiple({arrId})
            req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, deletedCount), false) 
            res.redirect(`${linkPrefix}`)
        }else{
            let { modifiedCount } = await contactService.ChangeStatusMultiple({arrId, action})
            req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, modifiedCount), false) 
            res.redirect(`${linkPrefix}`)
        }

    },

}
