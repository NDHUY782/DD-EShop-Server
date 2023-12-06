
// const renderName = `frontend/page/`;

// const ramdomstring = require('randomstring')
// const nodemailer =  require('nodemailer');

// const catchAsync  = require(`${__path_utils}catchAsync`)


// module.exports = {

//     ListSignup: catchAsync( async (req , res , next) => {
//             res.render(`${renderName}signup`,{
//             })
//         }
//     ),

//     ListCheckCode: catchAsync( async (req , res , next) => {
//         const { username, password, hoten, phone, email } = req.body
//         let item = {}

//         item.username = username
//         item.password = password
//         item.hoten = hoten
//         item.phone = phone
//         item.email = email
//         item.status = 'active'

//         let data = JSON.stringify(item)

//         let code = ramdomstring.generate(7)

//         var transporter =  nodemailer.createTransport({ // config mail server
//             service: 'Gmail',
//             auth: {
//                 user: '18520878@gm.uit.edu.vn',
//                 pass: 'azeszsmbvatldpsw'
//             }
//         });
//         var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
//             from: '18520878@gm.uit.edu.vn',
//             to: item.email,
//             subject: 'Mã Kích Hoạt',
//             text: 'You recieved message from ' + req.body.email,
//             html: `<p>Mã kích hoạt của bạn là: ${code}</p>`
//         }
//         transporter.sendMail(mainOptions, function(err, info){
//             if (err) {
//                 console.log(err);
//                 res.redirect('/dang-ky');
//             } else {
//                 console.log('Message sent: ' +  info.response);
//                 res.render(`${renderName}check_code`,{
//                     code,
//                     data
//                 })
//             }
//         });
//     }),

// }