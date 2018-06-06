var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    Students  = require('../../models/student'), //Importing multiple models and schemas
    authFunctions = require('../../validation/authFunctions');

//****************************************************************************************
//****************************************************************************************


router.get("/studentNotifications",function (req,res) {
  Students.findById(req.user.username, (err,stud ) => {
    var notifications = stud.notifications;
    console.log(notifications);
    res.render("./student/studentNotifications.ejs",{notifications:notifications})
  });
})

router.delete("/deleteNotification/:id",function(req,res){

  Students.findById(req.user.username,function(err,stud){
    if (err) {
      console.log(err);
    } else {
      stud.notifications.pull(req.params.id);
      stud.save();
    }
  })

  res.redirect('/studentNotifications');
  });

module.exports = router;
