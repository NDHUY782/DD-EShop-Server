// const CategoryAccountService = require(`${__path_services}backend/category_account_service`);

// module.exports = async (req, res, next) => {

//     if(req.isAuthenticated()){

//         if (req.user.role !== undefined) {
//             let {data} = await CategoryAccountService.findIdAdmin(req.user.role)

//             if(data.name === 'boss'){
//                 next()
//             }
//             else{
//                 res.redirect('/dhuy782/no-permission')
//                 res.end()
//             }
//         } else {
//             res.redirect('/dhuy782/no-permission')
//             res.end()
//         }
//     }else {
//         res.redirect('/dang-nhap')
//     }
// };