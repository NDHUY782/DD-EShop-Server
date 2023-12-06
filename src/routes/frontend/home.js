
const express = require('express')
const router = express.Router()

const loginFrontEndMiddleware = require('../../middleware/login_frontend')

const HomeController = require(`${__path_controllers}frontend/home_controller`)

 
router
    .route('/')
    .get(HomeController.ListHome)   
    
router
    .route('/ve-chung-toi')
    .get(HomeController.ListIntroduce)
    
router
    .route('/the-hoi-vien')
    .get(HomeController.ListMembership) 
    
router
    .route('/chinh-sach-doi-tra')
    .get(HomeController.ListPolicy)

router
    .route('/don-hang(/:action)?')
    .get( HomeController.Invoice)

router
    .route('/contact')
    .post(HomeController.Contact)

module.exports = router;