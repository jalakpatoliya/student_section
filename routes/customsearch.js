//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    mongoXlsx = require("mongo-xlsx"),
    bodyParser = require("body-parser"),
    multer    = require("multer"),
    models  = require('../models/student'),
    keys = require('all-object-keys'),
    get = require('get-value'),
    flat = require('flat'),
    storage = multer.diskStorage(
      {
        destination: function (req, file, cb) {cb(null, 'uploads/')},
        filename: function (req, file, cb) {cb(null, file.originalname)}
      }),
  authFunctions  = require('../validation/authFunctions');

var upload = multer({ storage: storage }),
    router      = express.Router();

//=======================================================================

//======================
// SHOW ROUTE
//======================
router.get("/customsearch",authFunctions.isLoggedIn,function(req,res){
  res.render("customsearch.ejs",{key:null})
})

router.post("/customsearch",authFunctions.isLoggedIn,function(req,res){
  console.log("customsearch post");

  //======================== spliting req.body parameters =============
  var f1  = req.body.Basic,
      f2  = req.body.Details,
      f12 = f2.toString().split(','),
      f11 = f1.toString().split(',');
  var qvar ='';
  for(l1=0;l1< f11.length;l1++){
    qvar= qvar+' '+f11[l1];
  }
  for(l1=0;l1< f12.length;l1++){
    qvar= qvar+' '+f12[l1];
  }

  //================= Query ===========================================

    models.find()
    .select(qvar)
    .lean().exec(function(err,data){

    if(err){
      console.log("customserch finding data error =>",err);

    }
    else{

    //============ Logical errors ===try ===========================

//var key = keys(data[0]);            //issue  -- if first o/p is empty then whole structure is disturbed
var key=f11.concat(f12);         //issue  -- can't get the whole nested doc

    for(i=0;i< data.length;i++){
//for(j=0;j< key.length;j++){

// console.log(get(data[i],keys(data[i])[j]));
console.log("=>",keys(data[i]).length);
console.log("==>",keys(data[i]));
//}
}
    //==============================================================

      res.render("customsearch.ejs",{key:key,data:data,get:get})
    }

//=========================================================
  });

})

module.exports = router;
