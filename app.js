//==============================================================================
//======================  Importing dependencies  ==================================
//==============================================================================
var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    mongoXlsx = require("mongo-xlsx"),
    multer    = require("multer"),
    app = express(),
    storage = multer.diskStorage(
      {
        destination: function (req, file, cb) {cb(null, 'uploads/')},
        filename: function (req, file, cb) {cb(null, file.originalname)}
      });
var upload = multer({ storage: storage });
//==============================================================================
//======================  connecting database  ==================================
//==============================================================================
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/demo3",function(err,data){
  if(err){console.log("connection error",err);}
  else{console.log("connection sucessful");}
});

//==============================================================================
//======================  Importing models  ==================================
//==============================================================================
var Students  = require("./models/student");
//==============================================
//===================Using body parser==========
//==============================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//============================================================================
//===================== acquiring router =====================================
//============================================================================
var indexRoute   = require('./routes/index'),
    searchRoute  = require('./routes/search'),
    showError    = require('./routes/error'),
    filt      = require('./routes/customsearch');


app.use(indexRoute);
app.use(searchRoute);
app.use(showError);
app.use(filt);

//============================================================================
//====================== rough data ==========================================
//============================================================================
// Students.create({
//   _id:150160702013,
//   cur_sem:8
// },function(err,data){
//   if(err){console.log("insertio failed");}
//   else{console.log("sucessfully inserted");}
// })
//============================================================================
//============================================================================
//===========================================================================
app.listen(3823,function(){
  console.log("server started at 3823");
})
