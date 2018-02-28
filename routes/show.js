//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    models  = require('../models/student'); //Importing multiple models and schemas
    authFunctions = require('../validation/authFunctions');
//=======================================================================

//======================
// SHOW ROUTE
//======================
router.get("/show",authFunctions.isLoggedIn,function(req,res){
  models.Students.find({},function(err,student){
    if (err) {
      console.log(err);
    } else {
      console.log(student);
      res.render("show.ejs",{data:student})
    }
  })
})



module.exports = router;
