//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    Students  = require('../../models/student'); //Importing multiple models and schemas
    authFunctions = require('../../validation/authFunctions');
//=======================================================================

router.get("/receipts/:filename",function(req,res){
  var filename= req.params.filename;
  res.render("./user/receipts.ejs",{filename:filename})
})


module.exports = router;
