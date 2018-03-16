//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    models   = require('../models/student'),//Importing multiple models and schemas
    validate = require('../validation/insertValidate')
//=======================================================================

//======================
// SHOW ROUTE
//======================
router.get("/error",function(req,res){

      var errorList = validate.toEmptyError();
      console.log('error req initiated');
    
      res.render("showError.ejs",{errorList:errorList});


})



module.exports = router;
