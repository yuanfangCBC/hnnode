const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://127.0.0.1:27017/hn');
db.once("open",function(callback){
    console.log("db connect ok");
})
module.exports = db;