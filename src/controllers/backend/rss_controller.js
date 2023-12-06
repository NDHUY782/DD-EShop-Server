const routerName = 'article';
const renderName = `backend/page/${routerName}/`;

const RssService = require(`${__path_services}backend/rss_service`);

module.exports = {
    getRss: async (req , res , next) => {
            await RssService.getRss(req, res)
    },
}
