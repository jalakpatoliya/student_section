//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    Students  = require('../models/student'); //Importing multiple models and schemas
//=======================================================================

//======================
// Search ROUTE
//======================
router.get("/search",function(req,res){
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

module.exports = router;
