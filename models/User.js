const mongoose = require('mongoose');
const db = require("./db.js");

// Schema 结构
const userSchema = new mongoose.Schema({
    account : Number,
    pwd : String,
    name : String,
    beizhu : String,
    pinlei : [],
    headimg : String
}) 

userSchema.index({"account":1});

//静态方法
userSchema.statics.findByAccount = function(account,callback){
    this.model('User').find({"account":account},callback);
}
userSchema.statics.findById = function(id,callback){
    this.model('User').find({"_id":id},callback);
}

//创建一个model  基于schema
var userModel = db.model('User', userSchema);
//向外暴暴露这个model
module.exports = userModel;