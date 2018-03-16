//=================================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    Students  = require('../../models/student'); //Importing multiple models and schemas
    authFunctions = require('../../validation/authFunctions');
/*******************************************************************************/
    var async = require("async");
    var nodemailer = require("nodemailer");
    var listofemails  = [];
    var success_email = [];
    var failure_email = [];

      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
                  type: 'OAuth2',
                  user: 'fygecmodasa@gmail.com',
                  clientId: '366431355006-5ut34qv0rodupqs8c4qcadge11154522.apps.googleusercontent.com',
                  clientSecret: 'cVuwdxCKN-ZtMhZ037ePd6lZ',
                  refreshToken: '1/i1zddoS6vhuOPHao1yoKcCKnMQW6UlxfF5yySwfYtBA'
          }
      })
/*******************************************************************************/
//=======================================================================

//======================
// SHOW ROUTE
//======================
router.get("/notify",authFunctions.isLoggedIn,function(req,res){

////////////////////////////////////////////////////////////////////////////////
  function massMailer() {
  	var self = this;
  	// Fetch all the emails from database and push it in listofemails process remaining
    //writing continue
     listofemails.push()
     //===============================================================


  	self.invokeOperation();
  };

  massMailer.prototype.invokeOperation = function() {
  	var self = this;
  	async.each(listofemails,self.SendEmail);
  }


  massMailer.prototype.SendEmail = function(Email,callback) {
  	console.log("Sending email to " + Email);
  	var self = this;
  	self.status = false;
  	async.waterfall([
  		function(callback) {
        var mailOptions = {
            from: 'GEC <fygecmodasa@gmail.com>',
            to: Email,
            subject: 'bulk3',
            text: 'ulk mail 1'
        }
  			transporter.sendMail(mailOptions, function(error, info) {
  				if(error) {
  					console.log(error)
  					failure_email.push(Email);
  				} else {
  					self.status = true;
  					success_email.push(Email);
  				}
  			});
  		},
  	]);
  }

  new massMailer(); //lets begin
////////////////////////////////////////////////////////////////////////////////
res.render("./admin/notify.ejs")
})



module.exports = router;
