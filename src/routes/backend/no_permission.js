const express = require('express')

const router = express.Router()
const NoPermissionController = require(`${__path_controllers}backend/no_permission_controller`)
 
router
    .route('/')
    .get(NoPermissionController.getNoPermission)  

module.exports = router;