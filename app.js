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
    showRoute  = require('./routes/show');
app.use(indexRoute);
app.use(showRoute);
//==============================================
//--------------------Using body parser--------
app.use(bodyParser.urlencoded({
  extended: true
}));
//---------------------------------------------
// //======================Search Route==================
// app.get("/search",function(req,res){
//   var query = req.query.search_query;
//   Students.findById(query,function (err,data) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("show.ejs",{data:data});
//       console.log(data);
//     }
//   })
//
// })
//
// //======================================================



app.listen(3823,function(){
  console.log("server started");
})
