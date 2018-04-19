//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    Students  = require('../models/student'); //Importing multiple models and schemas
    authFunctions = require('../validation/authFunctions');
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
  console.log(req.body);
  res.render("./user/showReceipts.ejs")
})




module.exports = router;
