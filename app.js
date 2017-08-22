const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const router = require('./router/router.js')
// 引入文件模块
const fs = require('fs');
// 引入处理路径的模块
const path = require('path');

//路由中间件 静态页面
app.use("/upload",express.static("./upload"))

//使用req.body post请求 添加
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/login',router.tologin);
app.post('/api/regist',router.toregist);

app.post("/api/userinfo",router.getUserinfoById);
app.post("/api/getUserpinleis",router.getUserpinleis);
app.post("/api/getpinleis",router.getAllPinlei);
app.post("/api/updateUserPinlei",router.updateUserPinlei);
app.post("/api/uploadHeadimg",router.uploadHeadimg);
app.post("/api/getuserZixun",router.getuserZixun);
app.post("/api/getzixun",router.getzixun);
app.post("/api/gettjInfo",router.gettjInfo);
app.post("/api/getaskInfo",router.getaskInfo);

// app.get("/api/gettjInfo",function(req,res){
//     res.send("oklll")
// })
app.get("/",function(req,res){
    res.send("ok")
})

// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
// app.use(express.static(path.resolve(__dirname, 'E:/judian/learn/vue/新建文件夹/hntest/dist')))
// // 因为是单页应用 所有请求都走/dist/index.html
// app.get('*', function(req, res) {
//     const html = fs.readFileSync(path.resolve(__dirname, 'E:/judian/learn/vue/新建文件夹/hntest/dist/index.html'), 'utf-8')
//     res.send(html)
// })

app.listen(3000);
