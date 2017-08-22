const mongoose = require('mongoose');
const db = require("./db.js");

// Schema 结构
const pinleiSchema = new mongoose.Schema({
    name : String,
    info : String,
    uid : []
}) 

pinleiSchema.index({"name":1});

//静态方法
pinleiSchema.statics.findAll = function(callback){
    this.model('Pinlei').find({},callback);
}

//创建一个model  基于schema
var pinleiModel = db.model('Pinlei', pinleiSchema);
//向外暴暴露这个model
module.exports = pinleiModel;