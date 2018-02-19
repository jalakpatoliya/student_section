//=====================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    mongoXlsx = require("mongo-xlsx"),
    bodyParser = require("body-parser"),
    multer    = require("multer"),
    storage = multer.diskStorage(
      {
        destination: function (req, file, cb) {cb(null, 'uploads/')},
        filename: function (req, file, cb) {cb(null, file.originalname)}
      });
var upload = multer({ storage: storage }),
    router      = express.Router();
var flatten = require('flat');
//===============================================================================
//======================= Accuring internal module =============================
//===============================================================================
var Students   = require("../models/student");
var model=null;
var validate     = require('../validation/insertValidate');
//==============================================
//===================Using body parser==========
//==============================================
router.use(bodyParser.urlencoded({
  extended: true
}));
//======================================
// GET Route
//======================================
router.get("/edit",function(req,res){
  var enroll = req.query.searched_enroll;
  console.log(enroll);
  Students.findById(enroll,function (err,data) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit.ejs",{data:data});
    }
  })

})
//======================================
// PoST Route
//======================================
router.post("/edit",function (req,res) {
  console.log(req.body.basic);
  console.log(req.body.enroll);
  var obj = {basic:req.body.basic};
console.log(obj);

  Students.findByIdAndUpdate(req.body.enroll,flatten(obj),{overwrite:false},function (err,UpdatedData) {
    if (err) {
      console.log(err);
    } else {
      console.log("UpdatedData:",UpdatedData);
      Students.findById(req.body.enroll,function (err,data) {
        if (err) {
          console.log(err);
        } else {
          res.render("show.ejs",{data:data});
        }
      })
    }
  })


})



module.exports = router;
