const routerName = 'donHang';
const renderName = `backend/page/${routerName}/`;

const linkPrefix = `/dhuy782/donHang/`

const util = require('util')

const paramsHelpers = require(`${__path_helpers}params`)
const notify  		= require(`${__path_configs}notify`)
const SlugHelpers   = require(`${__path_helpers}slug`)
const nodemailerDonHangHelpers   = require(`${__path_helpers}nodemailer_donhang`)
const {validationResult} = require('express-validator')

const donHangService = require(`${__path_services}backend/donHang_service`);
const accountService = require(`${__path_services}backend/account_service`);

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
            if(keyword !== '') condition = {maDonHang: {$regex: keyword, $options: 'i'}}
        }else {
            condition = {status: currentStatus, maDonHang: {$regex: keyword, $options: 'i'}}
        }

        let allUser          = await accountService.findAllUser({})
        let arrIdUser = []
        allUser.data.forEach(value => {
            arrIdUser.push(value.id)
        })
        condition.idUserName = { $in: arrIdUser }

        let { data }  = await donHangService.getAll({pagination, condition, sort})
        let items = []
        for (let i = 0; i < data.length; i++) {
            let name = {}
            let {username} = await accountService.findUserName(data[i].idUserName)
            name.user         = username
            name.id           = data[i]._id
            name.maDonHang    = data[i].maDonHang
            name.idUserName   = data[i].idUserName
            name.diaChi       = data[i].diaChi
            name.sdt          = data[i].sdt
            name.sanpham      = data[i].sanpham
            name.ghichu       = data[i].ghichu
            name.NgayDat      = data[i].NgayDat
            name.tongTien     = data[i].tongTien
            name.status       = data[i].status
            items.push(name)
        }

        let choosedStatus = req.params.status;
        let statusFilter = await donHangService.countAll({choosedStatus})

        let pageTitle = 'Đơn Hàng'

        let arrStatus = [
                          {id: "cho-lay-hang",name: "Chờ lấy hàng"},
                          {id: "van-chuyen",name: "Vận chuyển"},
                          {id: "hoan-thanh",name: "Hoàn thành"},
                          {id: "da-huy",name: "Đã hủy"},
                        ]
 
        res.render(`${renderName}list` , {
            items :        items,
            pageTitle,
            currentStatus,
            keyword,
            pagination,
            statusFilter:  statusFilter,
            sortType,
            sortField,
            arrStatus
        })
    },

    getForm : async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')

        let { pageTitle, data } = await donHangService.getForm({id})

        let name = {}
        let {username, email} = await accountService.findUserName(data.idUserName)
        name.user         = username
        name.email        = email

        res.render(`${renderName}form` , {
            pageTitle,
            items :  data,
            name : name
        });
    },

    getSort: async (req , res , next) => {
        req.session.sortField      = paramsHelpers.getParam(req.params, 'sort_field', 'ordering')
        req.session.sortType       = paramsHelpers.getParam(req.params, 'sort_type', 'asc')
        
        res.redirect(`${linkPrefix}`)
    },

    getStatus: async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')
        let status = paramsHelpers.getParam(req.params, 'status', 'cho-lay-hang')

        let data = await donHangService.changeStatus({id, status})

        data.name = "status"
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

        let {success} = await donHangService.changeNumber({id, data})

        res.send({
            success,
            id,
            number,
            collection
        })
    },

    deleteItem: async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')

        await donHangService.deleteItem({id})

        req.flash('warning', notify.DELETE_SUCCESS)           
        res.redirect(`${linkPrefix}`)
    },

    saveItem: async (req, res, next) => {
        req.body = JSON.parse(JSON.stringify(req.body))
        let item = Object.assign(req.body)

        let slug = SlugHelpers.slug(item.name)
        item.slug = slug

        if(typeof item !== 'undefined' && item.id !== ""){ //edit
            donHangService.editItem(item)
            req.flash('success', notify.EDIT_SUCCESS) 
            res.redirect(`${linkPrefix}`)
        }else{ // add
            donHangService.addItem(item)
            req.flash('success', notify.ADD_SUCCESS) 
            res.redirect(`${linkPrefix}`)
        }
    },

    changeMultipleAction: async (req, res, next) => {
        let action = req.body.action
        let arrId  = req.body.cid

        if (action === 'delete') {
            let { deletedCount } = await donHangService.ChangeDeleteMultiple({arrId})
            req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, deletedCount)) 
            res.redirect(`${linkPrefix}`)
        }else{
            let { modifiedCount } = await donHangService.ChangeStatusMultiple({arrId, action})
            req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, modifiedCount)) 
            res.redirect(`${linkPrefix}`)
        }

    },

}
