const routerName = 'dashboard';
const renderName = `backend/page/${routerName}/`;

const fs = require('fs');

const DashBoardService = require(`${__path_services}backend/dashboard_service`);

module.exports = {
    getList: async (req , res , next) => {
 
            fs.readFile('src/public/uploads/arrUser.txt', (err, data) => {
                arrUserInfor = JSON.parse(data);
            })
            let data = await DashBoardService.getList(req, res)

            res.render(`${renderName}index` , {
                items :  data,
                arrUserInfor,
            });
    },
}
