const express = require('express')

const router = express.Router()

const SlugController = require(`${__path_controllers}frontend/slug_controller`)
 
router
    .route('/:slug')
    .get(SlugController.ListSlug) 

module.exports = router;