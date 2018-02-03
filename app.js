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
mongoose.connect("mongodb://localhost/demo3");

//==============================================================================
//======================  Importing models  ==================================
//==============================================================================
var Students  = require('./models/student');
//============================================================================
//===================== acquiring router =====================================
//============================================================================
var indexRoute = require('./routes/index'),
    searchRoute  = require('./routes/search');
app.use(indexRoute);
app.use(searchRoute);
//============================================================================
//===================== Using body parser=============================
//============================================================================
app.use(bodyParser.urlencoded({
  extended: true
}));
//============================================================================
//===================== To include /public folder=============================
//============================================================================
app.use(express.static(__dirname + '/public'));


app.listen(3823,function(){
  console.log("server started");
})
