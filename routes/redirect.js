var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    authFunctions = require('../validation/authFunctions');
//=======================================================================

//======================
// SHOW ROUTE
//======================
router.get("/redirect",authFunctions.isLoggedIn,function(req,res){
  //console.log(req.user);
  if(req.user.role=="admin"){
    res.render("./admin/awelcome.ejs")
  }
  else if(req.user.role=="user"){
    res.render("./admin/awelcome.ejs")
  }
 })



module.exports = router;
