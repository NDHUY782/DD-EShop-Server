
const UserModel = require('../../models/user_model');
const AdminModel = require('../../models/authen_model');
const bcrypt = require('bcrypt');
const config = require('../../configs/config');
const jwt    = require('jsonwebtoken')
const randormString = require("randomstring")
const nodemailer = require('nodemailer')
const ContactModel = require(`${__path_models}contact_model`)

const getBase64 = require(`${__path_helpers}image`)
const cloudinaryStorage = require(`${__path_configs}cloudinary`)

//tạo token
const create_token = async (id) => {
    try {
        
        const token = await jwt.sign({ _id:id }, config.secret_jwt)
        return token;


    } catch (error) {
        res.status(400).send(error.message)
    }
}

//gửi mail
const sendResetPasswordMail = async(hoten,email,token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS:true,
            auth: {
            user:config.emailUser, // generated ethereal user
            pass:config.emailPassword , // generated ethereal password
            },
        });

        
        const mailOption = {
            from: config.emailUser, // sender address
            to: email, // list of receivers
            subject: "For reset passsword", // Subject line
            text: "Xin Cảm Ơn - Chúc Bạn Có 1 Ngày Tốt Lành", // plain text body
            html: '<p>Xin Chào '+ hoten +',Hãy Bấm Vào Đây <a href="https://md20-eshop.vercel.app/reset-password/'+ token + '"> Để Thay Đổi Password </a> Của Bạn.</p>'
        } 
        transporter.sendMail(mailOption,function (error,info) {
            if (error) {
                console.log(error)
            } else {
                console.log("email has been sent",info.response)
            }
        })
        

    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}
const sendContactMail = async(firstname,lastname,email,token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS:true,
            auth: {
            user:config.emailUser, // generated ethereal user
            pass:config.emailPassword , // generated ethereal password
            },
        });

        
        const mailOption = {
            from: config.emailUser, // sender address
            to: email, // list of receivers
            subject: "Thanks For Contact", // Subject line
            text: "Xin Cảm Ơn - Chúc Bạn Có 1 Ngày Tốt Lành", // plain text body
            html: '<p>Xin Chào '+ firstname +' '+ lastname +',' + 'Cảm ơn bạn để liên hệ với chúng tôi </a>.</p>'
        } 
        transporter.sendMail(mailOption,function (error,info) {
            if (error) {
                console.log(error)
            } else {
                console.log("email has been sent",info.response)
            }
        })
        

    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}
//mã hóa password
const securePassword = async (password) => {
    try {
        const passwordHash = await  bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        res.status(400).send(error.message)
    }
}
//đăng ký user
const register_user = async (req,res) => {
    try {
        const spassword = await securePassword(req.body.password)

        // const imageBase64 = await getBase64(req.file.path)
        // const secure_url = await cloudinaryStorage
        //     .uploadCloudinary(`data:${req.file.mimetype};base64,${imageBase64}`, req.file.filename.split('.')[0])

        const user = new UserModel({
            username : req.body.username,
            password : spassword,
            email    : req.body.email,
            // image    : secure_url,
            mobile   : req.body.mobile,
            hoten    : req.body.hoten,
        })

        const userData = await UserModel.findOne({username: req.body.username});
        if (userData) {
            res.status(400).send({success: false,msg:" Username đã được sử dụng"})
        } else {
            const userEmail = await UserModel.findOne({email: req.body.email})
            if (userEmail) {
                res.status(400).send({success: false,msg:" Email đã được sử dụng"})
            } else {
                const user_data = await user.save();
                res.status(200).send({success: true,data: user_data})
            }
        }


    } catch (error) {
        res.status(400).send(error.message)
    }
};
//đăng nhập user
const user_login = async (req,res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const userData = await UserModel.findOne({username: username});
        const adminData = await AdminModel.findOne({username: username});

        if (userData) {
            const password_Login =  await bcrypt.compare(password, userData.password)

            if (password_Login) {

                const tokenData = await create_token(userData._id)
                const userResult = {
                    _id      :    userData._id,
                    username :    userData.username,
                    password :    userData.password,
                    email    :    userData.email,
                    hoten    :    userData.hoten,
                    image    :    userData.image,
                    mobile   :    userData.mobile,
                    hoten    :    userData.hoten,
                    role    :    userData.role,
                    token    :    tokenData,
 
                }
                const response = {
                    success  :      true,
                    data     :      userResult,
                }
                res.status(200).send(response)

            } else {
                res.status(400).send({success: false,msg:"Tài Khoản Hoặc Mật Khẩu Không Chính Xác"})
            }
        } else {
            res.status(400).send({success: false,msg:"Tài ccccc Khoản Hoặc Mật Khẩu Không Chính Xác"})
        }

    } catch (error) {
        res.status(400).send(error)
    }
}
//đăng nhập admin
const admin_login = async (req,res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const adminData = await AdminModel.findOne({username: username});

        if (adminData) {
            const password_Login =  await AdminModel.findOne({password:password})
            

            if (password_Login) {

                const adminResult = {
                    _id      :    adminData._id,
                    username :    adminData.username,
                    password :    adminData.password,
                    email    :    adminData.email,
                    hoten    :    adminData.hoten,
                    phone    :    adminData.phone,
 
                }
                const response = {
                    success  :      true,
                    data     :      adminResult,
                }
                res.status(200).send(response)

            } else {
                res.status(400).send({success: false,msg:"Tài Khoản Hoặc Mật Khẩu Không Chính Xác"})
            }
        } else {
            res.status(400).send({success: false,msg:"Tài Khoản Hoặc Mật Khẩu Không Chính Xác"})
        }

    } catch (error) {
        res.status(400).send(error)
    }
}

//Update Pass
const update_password = async (req,res) => {

    try { 
        const user_id = req.body.user_id;
        const password = req.body.password;

        const data = await UserModel.findOne({_id: user_id})
        if (data) {
            const newPassword  =  await  securePassword(password)
            const userData     =  await  UserModel.findByIdAndUpdate({_id: user_id}, {set : {
                password : newPassword
            }}) 

            res.status(200).send({success: true, msg:"Password được cập nhật"})

        } else {
            res.status(400).send({success: false, msg: "User Id không được tìm thấy"})
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
}

//quên password
const forget_password = async (req,res) => {
    try {
        const email = req.body.email;
        const userData = await UserModel.findOne({ email : email }) 

        if (userData) {

            const randomString = randormString.generate();
            const data = await UserModel.updateOne({email:email},{$set:{ token:randomString}})
            sendResetPasswordMail(userData.hoten,userData.email,randomString);
            res.status(200).send({success: true,msg:"Hãy Kiểm Tra Mail Của Bạn Và Đổi Password Của Bạn"})


        } else {
            res.status(400).send({success: false,msg:"Tài Khoản Email Không Chính Xác"})
        } 
    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}

//reset password
const reset_password = async (req,res) => {
    try {
        const token = req.query.token;
        const tokenData = await UserModel.findOne({token:token})
        if (tokenData) {

            const password = req.body.password;
            const newPassword = await securePassword(password);
            const userData = await UserModel.findByIdAndUpdate({_id:tokenData._id},{$set:{ password: newPassword, token:''}},{new:true})
            res.status(200).send({success: true,msg:"Password Đã Được Thay Đổi",data:userData})

        } else {
            res.status(400).send({success: false,msg:"Đường Dẫn Không Tồn Tại"})
        }
    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}
const contact = async (req , res , next) => {
    try {

        const contact = new ContactModel({
            email       : req.body.email,
            firstname   : req.body.firstname,
            lastname    : req.body.lastname,
            mobile      : req.body.mobile,
            content     : req.body.content
        })

        const user_data = await contact.save();
        sendContactMail(user_data.firstname,user_data.lastname,user_data.email)
        res.status(200).send({success: true,data: user_data})
    }
    catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}




module.exports = {
    forget_password,
    register_user,
    user_login,
    update_password,
    reset_password,
    contact,
    admin_login
    
    // insertUser,
    // verifyMail,
    // loginLoad,
    // verifyLogin,
    // loadHome,
    // userLogout,
    // forgetLoad,
    // forgetVerify,
    // forgetPasswordLoad,
    // resetPassword,
}
