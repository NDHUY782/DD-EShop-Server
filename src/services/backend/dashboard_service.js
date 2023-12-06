const ArticleModel = require(`${__path_models}article_model`)
const AuthenModel = require(`${__path_models}authen_model`)
const CategoryAccountModel = require(`${__path_models}category_account_model`)
const CategoryModel = require(`${__path_models}category_model`)
const CategoryProductModel = require(`${__path_models}category_product_model`)
const ContactModel = require(`${__path_models}contact_model`)
const donHangModel = require(`${__path_models}donHang_model`)
const maGiamGiaModel = require(`${__path_models}maGiamGia_model`)
const MenuModel = require(`${__path_models}menu_model`)
const phiVanChuyenModel = require(`${__path_models}phiVanChuyen_model`)
const ProductModel = require(`${__path_models}product_model`)
const SettingModel = require(`${__path_models}setting_model`)
const SliderModel = require(`${__path_models}slider_model`)

const accountService = require(`${__path_services}backend/account_service`);

module.exports = {
    getList: async (req, res) => {
        let data = {}

        data.article         = await ArticleModel.find({}).count()
        data.authen          = await AuthenModel.find({}).count()
        data.categoryAccount = await CategoryAccountModel.find({}).count()
        data.category        = await CategoryModel.find({}).count()
        data.categoryProduct = await CategoryProductModel.find({}).count()
        data.contact         = await ContactModel.find({}).count()
        data.maGiamGia       = await maGiamGiaModel.find({}).count()
        data.menu            = await MenuModel.find({}).count()
        data.phiVanChuyen    = await phiVanChuyenModel.find({}).count()
        data.product         = await ProductModel.find({}).count()
        data.setting         = await SettingModel.find({}).count()
        data.slider          = await SliderModel.find({}).count()

        data.donHang         = []
        let allUser          = await accountService.findAllUser({})
        let arrIdUser = []
        allUser.data.forEach(value => {
            arrIdUser.push(value.id)
        })
        let condition = {}
        condition.idUserName = { $in: arrIdUser }
        let donhang          = await donHangModel.find(condition).limit(10)

        for (let i = 0; i < donhang.length; i++) {
            let name = {}
            let {username}    = await accountService.findUserName(donhang[i].idUserName)
            name.user         = username
            name.id           = donhang[i]._id
            name.sdt          = donhang[i].sdt
            name.tongTien     = donhang[i].tongTien
            name.status       = donhang[i].status
            data.donHang.push(name)
        }

        data.showAccount     = await AuthenModel.find({}).limit(10).sort({lastDateLogin: -1})

        return data;
    },
    
}
