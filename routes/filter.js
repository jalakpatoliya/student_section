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
//======================
// Filter ROUTE
//======================
router.get("/filter",function(req,res){
     res.render("filter.ejs");
})

router.post("/filter",function(req,res){
  console.log(req.body.drop);
  res.redirect("/filter");
})


module.exports = router;
