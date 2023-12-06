const { Schema , model } = require("mongoose")

const ContactModel = new Schema({
    status : {
        type : String,
    },
    email : {
        type : String,
    }
}, {
    timestamps : true
}) 


module.exports = model('contacts' , ContactModel)