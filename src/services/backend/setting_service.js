const Parser = require('rss-parser');
const parser = new Parser();

const SettingModel = require(`${__path_models}setting_model`)

module.exports = {
    getSetting: async () => {
        let data = {}
        data = await SettingModel.find({})

        return {
            data
        }
    },
    
    editSetting: async (obj) => { // (NewData add, edit item)
        await SettingModel.updateOne({ _id: obj.id }, obj.data);
    },

    show_frontend: async () => {
        let data = {}
        data = await SettingModel.find({})

        let dataSetting = JSON.parse(data[0].setting)

        return {
            dataSetting
        }
    }
}
