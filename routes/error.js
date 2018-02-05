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
      res.render("showError.ejs",{errorList:erroList})


})


module.exports = router;
