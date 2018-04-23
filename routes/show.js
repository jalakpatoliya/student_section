//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    Students  = require('../models/student'); //Importing multiple models and schemas
    authFunctions = require('../validation/authFunctions'),
    flatten       = require('flat');
//=======================================================================

//======================
// SHOW ROUTE
//======================
router.get("/show",authFunctions.isLoggedIn,function(req,res){
  Students.find({},function(err,student){
    if (err) {
      console.log(err);
    } else {
      console.log(student);
      res.render("show.ejs",{data:student})
    }
  })
})

//======================
// SHOW RECEIPTS ROUTE
//======================
router.get("/showReceiptsForm",authFunctions.isLoggedIn,function(req,res){
  res.render("./user/showReceiptsForm.ejs")
})

router.post("/showReceiptsForm",authFunctions.isLoggedIn,function(req,res){


  if (req.body.ReceiptType=='EFee_pdf') {

    var obj = { cur_sem:req.body.sem,basic:{branch:req.body.branch}};
    console.log(flatten(obj));
    Students.find().and([{$or:[{EFee_pdf:false},{EFee_pdf:null}]},flatten(obj)]).exec(function(err,studs_not){
      // console.log("studs_not:",studs_not);
      Students.find().and([{EFee_pdf:true},flatten(obj)]).exec(function(err,studs_had){
        // console.log("studs_had:",studs_had);
        res.render("./user/showReceipts.ejs",{studs_not:studs_not,studs_had:studs_had ,EFee:true})
      })
    })

  } else if (req.body.ReceiptType=='TFee_pdf') {
    var obj = { cur_sem:req.body.sem,basic:{branch:req.body.branch}};
    console.log(flatten(obj));
    Students.find().and([{$or:[{TFee_pdf:false},{TFee_pdf:null}]},flatten(obj)]).exec(function(err,studs_not){
      console.log(studs_not);
      Students.find().and([{TFee_pdf:true},flatten(obj)]).exec(function(err,studs_had){
        // console.log("studs_had:",studs_had);
        res.render("./user/showReceipts.ejs",{studs_not:studs_not,studs_had:studs_had,EFee:false})
      })
    })
  }
})


module.exports = router;
