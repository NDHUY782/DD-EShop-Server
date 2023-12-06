const routerName = 'slider';
const renderName = `backend/page/${routerName}/`;
const linkPrefix = `/dhuy782/slider/`

const { validationResult } = require('express-validator')
const util = require('util')

const utilsHelpers = require(`${__path_helpers}utils`)
const paramsHelpers = require(`${__path_helpers}params`)
const SlugHelpers   = require(`${__path_helpers}slug`)
const notify = require(`${__path_configs}notify`)
const fileHelpers = require(`${__path_helpers}file`)

const uploadAvatar = fileHelpers.upload('avatar', `${__path_public}uploads/sliders/`)

const SliderService = require(`${__path_services}backend/slider_service`);

module.exports = {
    getlist : async (req , res , next) => {
        let condition = {}
        let keyword = paramsHelpers.getParam(req.query, 'keyword', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')

        let { categoryItems } = await SliderService.getListCategory()
        let categoryItemsFilter = [...categoryItems];
        let arrIdCategory = []
        categoryItems.forEach(value => {
            arrIdCategory.push(value.id)
        })
        let sortField   = paramsHelpers.getParam(req.session, 'sortField', 'ordering')
        let sortType    = paramsHelpers.getParam(req.session, 'sortType', 'asc')
        let idCategory  = paramsHelpers.getParam(req.session, 'idCategory', '')
        let sort = {}

        categoryItemsFilter.unshift({ id: 'allvalue', name: 'All Category' })

        let pagination = {
            totalItem: 1,
            totalItemPerPage: 5,
            currentPage: parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRange: 3
        }
        sort[sortField] = sortType

        condition.id_category = { $in: arrIdCategory }
        if (idCategory !== '' && idCategory !== 'allvalue') condition.id_category = idCategory
        if (currentStatus !== 'all') condition.status = currentStatus
        if (keyword !== '') condition.name = { $regex: keyword, $options: 'i' }

        let { data }  = await SliderService.getAll({condition, pagination, sort})

        let choosedStatus = req.params.status;
        let statusFilter = await SliderService.countAll({choosedStatus, arrIdCategory})

        let pageTitle = 'Slider'
 
        res.render(`${renderName}list` , {
            items :        data,
            pageTitle,
            currentStatus,
            keyword,
            pagination,
            statusFilter:  statusFilter,
            categoryItems,
            categoryItemsFilter,
            sortType,
            sortField,
            idCategory
        })
    },

    getForm : async (req , res , next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')

        let { categoryItems }   = await SliderService.getListCategory()
        let { data, pageTitle } = await SliderService.getForm({id})

        categoryItems.unshift({ id: 'novalue', name: 'Choose Category' })

        res.render(`${renderName}form` , {
            pageTitle,
            items :  data,
            categoryItems
        });
    },

    getStatus: async (req , res , next) => {
        let id = paramsHelpers.getParam(req.params, 'id', '')
        let currentStatus = paramsHelpers.getParam(req.params, 'status', 'active')
        let status = (currentStatus === 'active') ? 'inactive' : 'active'
        let data = {
            status: status,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now()
            }
        }

        let { success } = await SliderService.changeStatus({id, data})

        res.send({
            success,
            id,
            currentStatus,
            status
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

        let {success} = await SliderService.changeNumber({id, data})

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
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now()
            }
        }

        let {success} = await SliderService.changeCategory({id, data})

        res.send({
            success,
            id,
            id_category
        })
    },

    deleteItem: async (req , res , next) => {
        let id            = paramsHelpers.getParam(req.params, 'id', '')
        let {avatar}      = await SliderService.findAvatar({id})

        await SliderService.deleteItem({id})

        fileHelpers.remove('src/public/uploads/sliders/', avatar)
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

                let { categoryItems }   = await SliderService.getListCategory()
                categoryItems.unshift({ id: 'novalue', name: 'Choose Category' })

                if(err.code === 'LIMIT_FILE_SIZE') err = 'Kích thước file ko phù hợp'
                errorArr['avatar'] = [err]

                let { data, pageTitle } = await SliderService.getForm({id})
                
                res.render(`${renderName}form`, {
                    pageTitle,
                    item: data,
                    errorArr,
                    categoryItems
                });
                return;
            }else{
                if (typeof item !== 'undefined' && item.id !== "") { //edit
                    if(req.files == undefined || req.files.length == 0){
                        item.avatar = item.image_old;
                    } else {
                        item.avatar = req.files[0].filename;
                        fileHelpers.remove('src/public/uploads/sliders/', item.image_old)
                    }
                    await SliderService.editItem(item)

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
                    await SliderService.addItem(item)

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
                    let {avatar}      = await SliderService.findAvatar({id: id[index]})
                    fileHelpers.remove('src/public/uploads/sliders/', avatar)
                }
            } else {
                let {avatar}          = await SliderService.findAvatar({id})
                fileHelpers.remove('src/public/uploads/sliders/', avatar)
            }
            let {deletedCount}        = await SliderService.changeDeleteMultiple({id})
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
            let {modifiedCount}        = await SliderService.changeStatusMultiple({id, data})
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
}
