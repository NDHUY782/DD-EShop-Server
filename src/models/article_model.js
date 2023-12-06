const { Schema , model } = require("mongoose")

const ArticleModel = new Schema({
    name : {
        type : String,
    },
    status : {
        type : String,
    },
    slug : {
        type : String,
    },
    ordering : {
        type : Number,
    },
    content : {
        type : String,
    },
    short_description : {
        type : String,
    },
    avatar : {
        type : String,
    },
    id_category : {
        type : String,
    },
    created: {
        user_id: Number,
        user_name: String,
        time: Date,
    },
    modified: {
        user_id: Number,
        user_name: String,
        time: Date,
    }
}) 


module.exports = model('articles' , ArticleModel)