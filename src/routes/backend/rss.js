const express = require('express')

const router = express.Router()
const RssController = require(`${__path_controllers}backend/rss_controller`)
 
router
    .route('/')
    .get(RssController.getRss)  

module.exports = router;