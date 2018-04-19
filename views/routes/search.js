//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    Students  = require('../models/student'), //Importing multiple models and schemas
    authFunctions = require('../validation/authFunctions');
//=======================================================================

//======================
// Search ROUTE
//======================
router.get("/search",authFunctions.isLoggedIn,function(req,res){
  var query = req.query.search_query;
  Students.findById(query,function (err,data) {
    if (err) {
      console.log(err);
    } else {

      res.render("show.ejs",{data:data});
      // console.log(data);
    }
  })

})
//======================
// Search ROUTE FoR STUDENT
//======================
router.get("/search/student",authFunctions.isLoggedIn,function(req,res){
  var query = req.user.username;
  Students.findById(query,function (err,data) {
    if (err) {
      console.log(err);
    } else {

      res.render("show.ejs",{data:data});
      // console.log(data);
    }
  })

})

module.exports = router;
