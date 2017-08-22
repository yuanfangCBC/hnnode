const User = require("../models/User.js")
const Pinlei = require('../models/Pinlei.js')
const Zixun = require('../models/Zixun.js')
const Tuijian = require('../models/Tuijian.js')
const Ask = require('../models/Ask.js')
const ObjectId = require('mongodb').ObjectID
const formidable = require('formidable')
const path = require('path')
const fs = require('fs');
//登录
exports.tologin = function(req,res){
    let account = req.body.account;
    let pwd = req.body.pwd;
    User.findByAccount(account,function(err,result){
        if(err || !result || result==""){
            res.json({"state":"0","data":""});
            return;
        }
        let mima = result[0].pwd;
        if(pwd == mima){
            res.json({"state":"1","data":result[0]});
        }else{
            res.json({"state":"-1","data":""});
        }
    })
    
}
//注册
exports.toregist = function(req,res){
    let account = req.body.account;
    let pwd = req.body.pwd;
    let name = req.body.name;
    User.create({"name":name,"account":account,"pwd":pwd,"beizhu":"农户","pinlei":"玉米","headimg":""},() => {
        User.findByAccount(account,(err,result) => {
            if(err || !result || result==""){
                res.json({"state":"0","data":""});
                return;
            }
            res.json({"state":"1","data":result[0]});
        })
    })
}

//获取用户信息
exports.getUserinfoById = function(req,res){
    let uid = req.body._id;
    User.findById(new ObjectId(uid),function(err,result){
        if(err || !result || result==""){
            res.json({"state":"0","data":""});
            return;
        }
        res.json({"state":"1","data":{"name":result[0].name,"beizhu":result[0].beizhu,"headimg":result[0].headimg}});
    })
}

//上传用户头像
exports.uploadHeadimg = function(req,res){
    const pathimg = "./upload/img/"
    let form = new formidable.IncomingForm();
    form.uploadDir = pathimg;
    form.extensions = true;
    form.parse(req,(err,fields,files) => {
        if(err){
            throw err;
        }
        var file = files.file;
        var uid = fields.uid;
        var oldpath = path.normalize(file.path);//返回正确格式的路径
        var newfilename = uid + "_" + file.name;
        var newpath = pathimg + newfilename;
        var dbimgpath = "/upload/img/" + newfilename;
        //将老的图片路径改为新的图片路径
        fs.rename(oldpath,newpath,function(err){
            if(err){
                console.error("改名失败"+err);
            }
            else {
                let update = {$set:{"headimg":dbimgpath}};
                let conditions = {"_id":new ObjectId(uid)};
                User.update(conditions,update,(err) => {
                    User.findById(new ObjectId(uid),(err,result) => {
                        if(err || !result){
                            res.json({"state":"0","data":""});
                            return;
                        }
                        res.json({"state":"1","data":result})
                    })
                    
                })
            }
        });
    })
    
}

//获取用户擅长品类
exports.getUserpinleis = function(req,res){
    User.findById({"_id":new ObjectId(req.body.uid)},(err,result) => {
        if(err || !result || result==""){
            res.json({"state":"0","data":""});
            return;
        }
        res.json({"state":"1","data":result})
    })
}
//获取全部品类
exports.getAllPinlei = function(req,res){
    // Pinlei.create({"name":"香蕉","info":"xxx"}, () => {
    //     res.json({"data":"ok"});
    // })
    Pinlei.findAll((err,result) => {
        if(err || !result || result==""){
            res.json({"state":"0","data":""});
            return;
        }
        res.json({"state":"1","data":result})
    })
}
//更新用户擅长品类
exports.updateUserPinlei = function(req,res){
    let pinlei = req.body.pinlei;
    let uid = req.body.uid;
    let update = {$set:{"pinlei":pinlei}};
    let conditions = {"_id":new ObjectId(uid)};
    User.update(conditions,update,(err) => {
        if(err){
            res.json({"state":"0","data":""});
            return;
        }
        //更新品类表用户信息
        // for(let item of pinlei){
        //     //第一个参数 要更新通过的键 
        //     Pinlei.update({"name":item},{$set:{"uid":uid}},(err) => {

        //     })
        // }
        
        //在将查找的用户擅长品类返回
        User.findById(new ObjectId(uid),(err,result) => {
            if(err || !result){
                res.json({"state":"0","data":""});
                return;
            }
            res.json({"state":"1","data":result})
        })
        
    })
}

//获取用户收藏资讯
exports.getuserZixun = function(req,res){
    // let json = {
    //     'title' : '我们说的对我们说的好',
    //     'label' : '',
    //     'date' : '2017-03-21',
    //     'zixunimg' : '/upload/img/5982c99cdd4a4f0c2ce3fb8c_IMG_7191.JPG',
    //     'author' : 'judian',
    //     'authorimg' : '',
    //     'readnum' : 0,
    //     'tucaonum' : 0
    // }
    // Zixun.create(json, () => {
    //     res.json({"data":"ok"});
    // })
    Zixun.findAll((err,result) => {
        if(err || !result || result==""){
            res.json({"state":"0","data":""});
            return;
        }
        res.json({"state":"1","data":result})
    })
}

exports.getzixun = function(req,res){
    let page = req.body.page;
    let pagesize = req.body.pagesize;
    let params = {"pagesize":pagesize,"page":page}
    Zixun.findFenye(params,(err,result) => {
        if(!result.data){
            res.json({"state":"0","data":"没有更多啦"})
            return ;
        }
        res.json({"state":"1","data":result.data});
    })
}

//获得首页推荐信息
exports.gettjInfo = function(req,res){
    // let json = {
    //     "tag" : 2,//1 aitem 2 bitem 3 citem
    //     "label" : "会员特供",
    //     "title" : "猪为什么不会飞呢",
    //     "time" : "50分钟前",
    //     "img" : "/upload/img/5982c99cdd4a4f0c2ce3fb8c_IMG_7191.JPG",
    //     "authorname" : "",
    //     "authorimg" : "",
    //     "authorlabel" : "",
    //     "read" : "",
    //     "talk" : ""
    // }
    // Tuijian.create(json, () => {
    //     res.json({"data":"ok"});
    // })
    let page = req.body.page;
    let pagesize = req.body.pagesize;
    let params = {"pagesize":pagesize,"page":page}
    Tuijian.findFenye(params,(err,result) => {
        if(!result.data){
            res.json({"state":"0","data":"没有更多啦"})
            return ;
        }
        res.json({"state":"1","data":result.data});
    })
    
}


//获得问答信息列表
exports.getaskInfo = function(req,res){
    // let json = {
    //     "authorname" : "子善",
    //     "authorimg" : "/upload/img/5982c99cdd4a4f0c2ce3fb8c_IMG_7191.JPG",
    //     "authorlabel" : "农户",
    //     "title" : "物理哇啦",
    //     "time" : "55分钟",
    //     "img" : ["/upload/img/5982c99cdd4a4f0c2ce3fb8c_IMG_7191.JPG","/upload/img/5982c99cdd4a4f0c2ce3fb8c_IMG_7191.JPG","/upload/img/5982c99cdd4a4f0c2ce3fb8c_IMG_7191.JPG"],
    //     "asknum" : 30,
    //     "gznum" : 40
    // }
    // Ask.create(json, () => {
    //     res.json({"data":"ok"});
    // })
    let page = req.body.page;
    let pagesize = req.body.pagesize;
    let params = {"pagesize":pagesize,"page":page}
    Ask.findFenye(params,(err,result) => {
        if(!result.data){
            res.json({"state":"0","data":"没有更多啦"})
            return ;
        }
        res.json({"state":"1","data":result.data});
    })
    
}