const { Schema , model } = require("mongoose")

const SettingModel = new Schema({
    setting : {
        type : String,
    }
}) 


module.exports = model('setting' , SettingModel)