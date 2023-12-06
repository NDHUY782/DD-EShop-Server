const express = require('express')

const router = express.Router()

const BlogController = require(`${__path_controllers}frontend/blog_controller`)
 
router
    .route('/')
    .get(BlogController.ListBlog)  

router
    .route('/:slug')
    .get(BlogController.ListBlogDetail)

module.exports = router;