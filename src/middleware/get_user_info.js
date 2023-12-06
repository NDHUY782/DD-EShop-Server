// const CategoryAccountService = require(`${__path_services}backend/category_account_service`);

// module.exports = async (req, res, next) => {
//     let userInfo = {}
//     if(req.isAuthenticated()){
//         userInfo = req.user
//         if (req.user.role !== undefined) {
//             let {data} = await CategoryAccountService.findIdAdmin(req.user.role)

//             if(data.name === 'admin' || data.name === 'boss'){
//                 userInfo.accept = "true" 
//             }
//         }
//     }
//     res.locals.userInfo = userInfo
//     next()
// };