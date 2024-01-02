
const UserModel = require('../../models/user_model');
const bcrypt = require('bcrypt');
const config = require('../../configs/config');
const jwt    = require('jsonwebtoken')
const randormString = require("randomstring")
const nodemailer = require('nodemailer')
const ContactModel = require(`${__path_models}contact_model`)
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
            html: '<p>Xin Chào '+ hoten +',Hãy Bấm Vào Đây <a href="https://dd-eshop.vercel.app/reset-password/('+ token +')'  + '"> Để Thay Đổi Password </a> Của Bạn.</p>'
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

         const user = new UserModel({
            username : req.body.username,
            password : spassword,
            email    : req.body.email,
            image    : req.file.filename,
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

// const securePassword = userModel.pre("save" , async function(next) {
//     if(!this.isModified('password')) {
//        return(next)
//     }
//     const hash = await  bcrypt.genSalt(10)
//     .then((salt => bcrypt.hash(this.password, salt)));
//     this.password = hash;
//     next()

//----------Reser Password


// ------------Send Maill---------------
// const sendMail = async(name,email,user_id) => {
//     try {
//         let transporter = nodemailer.createTransport({
                
//             service: "gmail",
//             auth: {
//             user:config.emailUser, // generated ethereal user
//             pass:config.emailPassword , // generated ethereal password
//             },
//         });

        
//         const mailOption = {
//             from: config.emailUser, // sender address
//             to: email, // list of receivers
//             subject: "Please Check Ur Mail", // Subject line
//             text: "Xin Cảm Ơn - Chúc Bạn Có 1 Ngày Tốt Lành", // plain text body
//             html: '<p>Hello'+name+',please click here to <a href="http://localhost:3000/verify?id='+user_id+'"> Verified </a> your mail.</p>'
//         } 
//         transporter.sendMail(mailOption,function (error,info) {
//             if (err) {
//                 console.log(error)
//             } else {
//                 console.log("email has been sent",info.response)
//             }
//         })
        

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const insertUser = async (req,res) => {
//     try {
//         const spassword = await securePassword(req.body.password)
//         const user = new UserModel({
//             name: req.body.name,
//             email: req.body.email,
//             mobile: req.body.mno,
//             avatar: req.file.filename,
//             password: spassword,
//             is_admin: 0,

//         });

//         const userData = await user.save()

//         if(userData) {

//             sendMail(req.body.name,req.body.email,userData._id)

//             res.render('./../views/frontend/page/users/registration.ejs',{message:"ur registration has been successfully, Please check ur mail to verify"})
//         }
//         else {
//             es.render('./../views/frontend/page/users/registration.ejs',{message:"ur registration has been fallure"})
//         }

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const verifyMail = async(req,res)=> {
//     try {
//        const updateInfo = await UserModel.updateOne({_id:req.query.id},{$set:{ is_varified:1} })
//        res.render('./../views/frontend/page/users/email-verified.ejs')

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// login user 

// const loginLoad = async(req,res)=> {
//     try {
//         res.render('./../views/frontend/page/users/login.ejs')
        
//     } catch (error) {
//         console.log(error.message)
//     }

// }

// const verifyLogin = async (req,res) => {
//     try {
//         const email = req.body.email;
//         const password = req.body.password
        
//         const userData = await UserModel.findOne({email:email})
//         if (userData) {
//             const passwordMatch = await bcrypt.compare(password,userData.password)
//             if (passwordMatch == true ) {
//                 if (userData.is_varified === 0) {
//                     res.render('./../views/frontend/page/users/login.ejs',{message:"Please verify ur mail"})
//                 } else {
//                     res.session,user_id = userData._id;
//                     res.redirect('http://localhost:3000')
//                 }
//             } else {
//                 res.render('./../views/frontend/page/users/login.ejs',{message:"Email-Password is sai"})
//             }

//         } else {
//             res.render('./../views/frontend/page/users/login.ejs',{message:"Email-Password is Wrong"})
//         }

        
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const loadHome = async (req,res)=> {
//     try {
        
//         const UserDate = await UserModel.findById({_id:req.session.id})
//         res.render('./../views/frontend/page/users/home.ejs',{user: UserDate })
//     } catch (error) {
//         console.log(error.message)
//     }
// }
// const userLogout = async(req,res)=> {
//     try {
//         req.session.detroy();
//         res.redirect('/')
//     } catch (error) {
//         console.log(error.message)
//     }
// }
// //Quên Mật Khẩu
// const forgetLoad = async(req,res)=> {
//     try {
//         res.render('../views/frontend/page/users/forget.ejs')
//     } catch (error) {
//         console.log(error.message)
//     }
// }
// const forgetVerify = async(req,res)=> {
//     try {
//         const email = req.body.email
//         const userData = await UserModel.findOne({email:email})
//         if (userData) {
            
//             if (userData.is_varified === 0) {
//                 res.render('../views/frontend/page/users/forget.ejs',{message:"Please Verify urr mail"})
//             }
//             else{
//                 const randomString = randormString.generate();
//                 const updateData = await UserModel.updateOne({email:email},{$set:{ token:randomString}})
//                 sendResetPasswordMail(userData.name,userData.email,randomString);
//                 res.render('../views/frontend/page/users/forget.ejs',{message:"Please check ur mail to reset pass"})
//             }
//         } else {
//             res.render('../views/frontend/page/users/forget.ejs',{message:"User incorrect!!!!"})
//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const forgetPasswordLoad = async(req,res)=> {
//     try {
//         const token = req.query.token;
//         const tokenData = await UserModel.findOne({token:token})
//         if (tokenData) {
//             res.render('../views/frontend/page/users/forget-password.ejs',{user_id:tokenData._id})
//         } else {
//             res.render('/404',{message:'Token is invalid'})
//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }
// const resetPassword = async(req,res)=> {
//     try {
//         const password = req.body.password;
//         const user_id = req.body.user_id;
//         console.log(password)
        
//         const secure_password = await securePassword(password)


//         const updatedData = await UserModel.findByIdAndUpdate({_id:user_id},{$set:{ password: secure_password, token:''}})

//         res.redirect('/login')

//     } catch (error) {
//         console.log(error.message)
//     }
// }
// const sendResetPasswordMail = async(name,email,token) => {
//     try {
//         let transporter = nodemailer.createTransport({
                
//             service: "gmail",
//             auth: {
//             user:config.emailUser, // generated ethereal user
//             pass:config.emailPassword , // generated ethereal password
//             },
//         });

        
//         const mailOption = {
//             from: config.emailUser, // sender address
//             to: email, // list of receivers
//             subject: "For reset password", // Subject line
//             text: "Xin Cảm Ơn - Chúc Bạn Có 1 Ngày Tốt Lành", // plain text body
//             html: '<p>Hello'+name+',please click here to <a href="http://localhost:3000/forget-password?token='+token+'"> Resset pass </a> your Password.</p>'
//         } 
//         transporter.sendMail(mailOption,function (error,info) {
//             if (err) {
//                 console.log(error)
//             } else {
//                 console.log("email has been sent",info.response)
//             }
//         })
        

//     } catch (error) {
//         console.log(error.message)
//     }
// }


module.exports = {
    forget_password,
    register_user,
    user_login,
    update_password,
    reset_password,
    contact,
    
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
