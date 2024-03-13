
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

const path = require('path');
// const session = require('express-session')
// const config = require('../../configs/config')


const UserController = require('../../controllers/backend/user_controller')

const multer = require('multer');

const auth = require('../../middleware/auth')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))

router.use(express.static('public'))

const storage = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.join(__dirname,'../../public/uploads/userImage'), function(error,success) {
            if(error) throw error
        })  
    },
    filename: function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name ,function(error1,success1) {
            if(error) throw error1
        });
    }
});

const upload = multer({storage:storage});

router
    .route('/register')
    .post(UserController.register_user)

router
    .route('/login')
    .post(UserController.user_login)

router
    .route('/test')
    .get(auth,function(req,res){
        res.status(200).send({success: true, msg:"Authenticated"})
    })
router
    .route('/update-password')
    .post(auth,UserController.update_password)

router
    .route('/forget-password')
    .post(UserController.forget_password)
router
    .route('/reset-password')
    .post(UserController.reset_password)

router
    .route('/contact')
    .post(UserController.contact)

module.exports = router;    