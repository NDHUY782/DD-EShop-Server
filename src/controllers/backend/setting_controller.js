const routerName = 'setting';
const renderName = `backend/page/${routerName}/`;
const linkPrefix = `/dhuy782/setting/`

const SettingModel = require(`${__path_models}setting_model`)

const notify = require(`${__path_configs}notify`)
const fileHelpers = require(`${__path_helpers}file`)
const uploadAvatar = fileHelpers.upload('logo', `${__path_public}uploads/logo/`)

const SettingService = require(`${__path_services}backend/setting_service`);


module.exports = {
    getSetting: async (req , res , next) => {

        let {data}  = await SettingService.getSetting()
        let dataSetting = JSON.parse(data[0].setting)

        dataSetting.id = data[0].id
        pageTitle = 'Settings Form'

        res.render(`${renderName}form` , {
            items : dataSetting,
            pageTitle
        })
    },

    saveSetting: async (req , res , next) => {
        uploadAvatar(req, res, async (err) => {
            req.body = JSON.parse(JSON.stringify(req.body))
            let item = Object.assign(req.body)
            // item.logo = req.files[0].filename

            const newSetting = JSON.stringify(item);
            let data = {}
            data.setting = newSetting


            // await new SettingModel(data).save().then(() => { 
            //     req.flash('success', notify.ADD_SUCCESS, false) 
            //     res.redirect(`${linkPrefix}`)
            // })

            if (err) {
                let errorArr = {}

                if(err.code === 'LIMIT_FILE_SIZE') err = 'Kích thước file ko phù hợp'
                errorArr['avatar'] = [err]

                let {data}  = await SettingService.getSetting()
                pageTitle = 'Edit - Form'
                
                res.render(`${renderName}form` , {
                    items : data,
                    pageTitle,
                    errorArr
                });
                return;
            } else {
                if(req.files == undefined || req.files.length == 0){
                    item.logo = item.image_old;
                } else {
                    item.logo = req.files[0].filename;
                    fileHelpers.remove('src/public/uploads/logo/', item.image_old)
                }
                id = item.id;

                const newSetting = JSON.stringify(item);
                let data = {}
                data.setting = newSetting

                await SettingService.editSetting({id, data})
                req.flash('success', notify.EDIT_SUCCESS, false)
                res.redirect(`${linkPrefix}`)
            }
        })
    },
}
