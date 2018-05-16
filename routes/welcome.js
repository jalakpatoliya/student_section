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

router.post('/welcome',function(req,res){
  console.log("came");
var  arr=req.body.students;
//console.log(arr);
  var listofemails=[];
  // arr.forEach(elem=>{
  //  listofemails.push((elem.basic.email).trim());
  // });

  len=arr.length;
  for(i=0;i<len;i++){
    listofemails.push((arr[i].basic.email).trim());
  }
  console.log(listofemails);
  res.redirect('/welcome')
})

module.exports = router;
