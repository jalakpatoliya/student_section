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
router.post("/notify",authFunctions.isLoggedIn,function(req,res){
  ////////////////////////////////////////////////////////////////////////////////
  var to,sem,sub,content;
        sub=req.body.sub;
        content=req.body.msg;

     Students.find().lean().exec(function(err,data){
          listofemails=[]
       if(req.body.branch=="all"){
         console.log("all");
         if(sem=="all"){
           data.forEach(elem=>{
             if((elem.basic.branch).trim()==(req.body.branch).trim()){
               listofemails.push((elem.basic.email).trim());
             }
           });//data.foreach
         }//all sem
         else{

           if(sem=="first"){
             data.forEach(elem=>{
             if(elem.cur_sem==1||elem.cur_sem==2){
               listofemails.push((elem.basic.email).trim());
             }
               });//data.forEach
           }else if(sem=="second"){
             data.forEach(elem=>{
             if(elem.cur_sem==3||elem.cur_sem==4){
               listofemails.push((elem.basic.email).trim());
             }
               });//data.forEach
           }else if(sem=="third"){
             data.forEach(elem=>{
             if(elem.cur_sem==5||elem.cur_sem==6){
               listofemails.push((elem.basic.email).trim());
             }
               });//data.forEach

           }else if(sem=="fourth"){
             data.forEach(elem=>{
             if(elem.cur_sem==7||elem.cur_sem==8){
               listofemails.push((elem.basic.email).trim());
             }
               });//data.forEach
           }

       }//else
       }//if all
       else{
         console.log("Specific");
         sem = (req.body.year).trim();
         if(sem=="all"){
           data.forEach(elem=>{
             if((elem.basic.branch).trim()==(req.body.branch).trim()){
               listofemails.push((elem.basic.email).trim());
             }
           });//data.foreach
         }//all sem
         else{
           data.forEach(elem=>{
             if((elem.basic.branch).trim()==(req.body.branch).trim()){
           if(sem=="first"){
             if(elem.cur_sem==1||elem.cur_sem==2){
               listofemails.push((elem.basic.email).trim());
             }

           }else if(sem=="second"){
             if(elem.cur_sem==3||elem.cur_sem==4){
               listofemails.push((elem.basic.email).trim());
             }

           }else if(sem=="third"){
             if(elem.cur_sem==5||elem.cur_sem==6){
               listofemails.push((elem.basic.email).trim());
             }

           }else if(sem=="fourth"){
             if(elem.cur_sem==7||elem.cur_sem==8){
               listofemails.push((elem.basic.email).trim());
             }
           }
         }//Branch
       });//data.foreach
         }//else all sem
       }//else specific
       //=============================sending mail===========================
       function massMailer() {
         var self = this;
      //   Fetch all the emails from database and push it in listofemails process remaining
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
              from: 'GEC Modasa <fygecmodasa@gmail.com>',
              to: Email,
              subject: sub,
              text: content
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

       //====================================================================

     });//.find


 console.log(listofemails,"--",sem);


       //===============================================================


  ////////////////////////////////////////////////////////////////////////////////
  res.render("./admin/notify.ejs")

})
router.get("/notify",authFunctions.isLoggedIn,function(req,res){
  res.render("./admin/notify.ejs")
})



module.exports = router;
