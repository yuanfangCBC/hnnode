const mongoose = require('mongoose');
const db = require("./db.js");

// Schema 结构
const askSchema = new mongoose.Schema({
    authorname : String,
    authorimg : String,
    authorlabel : String,
    time : String,
    title : String,
    img : Array,
    asknum : Number,
    gznum : Number
});

//askSchema.index({"account":1});//设置索引

//静态方法
askSchema.statics.findAll = function(callback){
    this.model('Ask').find({},callback);
}
//分页
askSchema.statics.findFenye = function(params,callback){
    // //应该省略的条数
    // let skipnumber = params.pageamount * params.page || 0;
    // let limit = params.pageamount || 0;
    // //排序方式
    // let sort = params.sort || {};
    // this.model.find(json).skip(skipnumber).limit(limit).sort(sort)
    pagesize = params.pagesize || 2;
    n = params.page || 1
    var query = this.model('Ask').find({});
    this.model('Ask').count().exec(function (err, count) {
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
var askModel = db.model('Ask', askSchema);
//向外暴暴露这个model
module.exports = askModel;