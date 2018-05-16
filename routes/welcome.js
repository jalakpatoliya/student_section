//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    authFunctions = require('../validation/authFunctions');
//=======================================================================

//======================
// SHOW ROUTE
//======================
router.get("/welcome",authFunctions.isLoggedIn,function(req,res){
      res.render("welcome.ejs")
})
 router.get("/",function(req,res){
   res.redirect("/index");
 })

router.post("/welcome",function(req,res){
  console.log(req.body.students);
    res.redirect("/welcome")
})

module.exports = router;
