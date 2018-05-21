

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')



const UserSchema = new Schema ({
    username: {
        type: String,
        required : true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        index: false,
        unique: false,
    },
    fullname: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    creationDate: {
        type:   Date
    },
    lastConnection: {
        type:   Date
    },
     avatar:{
        type: String
    }, 
/*     initial:{
        type: String
    }, */
    scope: {
        type: String
    },
    teams: [],
    sshKeys:[],
    password: String
})


UserSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Users', UserSchema)