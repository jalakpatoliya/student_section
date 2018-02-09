//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    bodyParser = require("body-parser"),
    multer    = require("multer"),
    models  = require('../models/student'); //Importing multiple models and schemas
//=======================================================================

//======================
// Filter ROUTE
//======================
router.get("/filter",function(req,res){
     res.render("filter.ejs",{data:null})
})

router.post("/filter",function(req,res){
  console.log("filter post initiated");
  //=====================Logic==================
  //============================================
  console.log(req.body.field1);
  var f1 = req.body.field1,
      f2 = req.body.field2,
      f3 = req.body.field3,
      f4 = req.body.field4,
      f5 = req.body.field5;
      if(f1=="eroll"){
        models.Students.findById(obj._id,function(err,data){
          res.render("filter.ejs",{data:data,count:data.count()});
        })
      }
  //============================================
})


module.exports = router;
