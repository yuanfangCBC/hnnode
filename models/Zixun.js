const mongoose = require('mongoose');
const db = require("./db.js");

// Schema 结构
const zixunSchema = new mongoose.Schema({
    title : String,
    label : String,
    date : String,
    zixunimg : String,
    author : String,
    authorimg : String,
    readnum : Number,
    tucaonum : Number
}) 

//zixunSchema.index({"account":1});//设置索引

//静态方法
zixunSchema.statics.findById = function(id,callback){
    this.model('Zixun').find({"_id":id},callback);
}
zixunSchema.statics.findAll = function(callback){
    this.model('Zixun').find({},callback);
}
zixunSchema.statics.findFenye = function(params,callback){
    // //应该省略的条数
    // let skipnumber = params.pageamount * params.page || 0;
    // let limit = params.pageamount || 0;
    // //排序方式
    // let sort = params.sort || {};
    // this.model.find(json).skip(skipnumber).limit(limit).sort(sort)
    pagesize = params.pagesize || 2;
    n = params.page || 1
    var query = this.model('Zixun').find({});
    this.model('Zixun').count().exec(function (err, count) {
        //Math.ceil(0.33) 1 向上取整
        let pages = Math.ceil(count/pagesize)
        if(n > pages){
            callback('',{"data":''});
            return;
        }
        query.skip(pagesize*(n-1)).limit(pagesize).exec('find', (err,result) => {
            callback('',{"data":result});
        });
    });
    
    
}

//创建一个model  基于schema
var zixunModel = db.model('Zixun', zixunSchema);
//向外暴暴露这个model
module.exports = zixunModel;