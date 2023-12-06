const express = require('express')

const router = express.Router()
const SettingController = require(`${__path_controllers}backend/setting_controller`)
 
router
    .route('/')
    .get(SettingController.getSetting) 
    
router
    .route('/form(/:id)?')
    .post(SettingController.saveSetting)

module.exports = router;