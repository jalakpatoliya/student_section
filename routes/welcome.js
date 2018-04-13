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



module.exports = router;
