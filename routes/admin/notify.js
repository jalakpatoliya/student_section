//=================================Importing all dependencies============
var mongoose              = require('mongoose'),
    express               = require('express'),
    router                = express.Router(),
    Students              = require('../../models/student'),
    User                  = require("../../models/user"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    authFunctions         = require('../../validation/authFunctions'),
    expressSession        = require("express-session"),
    path                  = require('path'),
    crypto                = require('crypto'),
    multer                = require("multer"),
    storage               = multer.diskStorage(
      {
        destination: function (req, file, cb) {cb(null, 'uploads/notifications/')},
        filename: function (req, file, cb) {cb(null, file.originalname)}
      }),
     upload        = multer({ storage: storage });

     //====================================================
     passport.use(new LocalStrategy(User.authenticate()));
     passport.serializeUser(User.serializeUser()); // it reades, decodes information in session,encodes it
     passport.deserializeUser(User.deserializeUser());

     // Express-session Middleware
     router.use(expressSession({
       secret: 'keyboard cat',
       resave: true,
       saveUninitialized: true,
       cookie: { secure: true }
     }))
     // Express-mesages Middleware
     router.use(require('connect-flash')());
     router.use(function (req, res, next) {
       res.locals.messages = require('express-messages')(req, res);
       next();
     });

    //****************************************************************************************
    //****************************************************************************************
    //****************************************************************************************
    var schedule = require('node-schedule');
    var async = require("async");
    var nodemailer = require("nodemailer");
    var listofemails  = [];
    var list_of_id  = [];
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
router.post("/notify",upload.array('file',100),function(req,res){


 if(req.body.eventoption=="instant"){

  ////////////////////////////////////////////////////////////////////////////////
  var to,sem,sub,content;
        sub=req.body.sub;
        content=req.body.msg;
        sem=req.body.year;


     Students.find().lean().exec(function(err,data){
          listofemails=[]
          list_of_id=[]
       if(req.body.branch=="all"){
         console.log("all");
         if(sem=="all"){
           data.forEach(elem=>{
             console.log(elem);
             console.log(elem.basic.email);
             Create_List_of_emails(elem.basic.email);
             Create_List_of_id(elem._id);
           });//data.foreach
           console.log("listofemails:",listofemails);
           console.log("list_of_id:",list_of_id);
         }//all sem
         else{

           if(sem=="first"){
             data.forEach(elem=>{
             if(elem.cur_sem==1||elem.cur_sem==2){
               Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
             }
               });//data.forEach
           }else if(sem=="second"){
             data.forEach(elem=>{
             if(elem.cur_sem==3||elem.cur_sem==4){
               Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
             }
               });//data.forEach
           }else if(sem=="third"){
             data.forEach(elem=>{
             if(elem.cur_sem==5||elem.cur_sem==6){
               Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
             }
               });//data.forEach

           }else if(sem=="fourth"){
             data.forEach(elem=>{
             if(elem.cur_sem==7||elem.cur_sem==8){
               Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
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
             if(elem.basic.branch==req.body.branch){
               Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
             }
           });//data.foreach
         }//all sem
         else{
           data.forEach(elem=>{
             if(elem.basic.branch==req.body.branch){
           if(sem=="first"){
             if(elem.cur_sem==1||elem.cur_sem==2){
               Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
             }

           }else if(sem=="second"){
             if(elem.cur_sem==3||elem.cur_sem==4){
               Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
             }

           }else if(sem=="third"){
             if(elem.cur_sem==5||elem.cur_sem==6){
               Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
             }

           }else if(sem=="fourth"){
             if(elem.cur_sem==7||elem.cur_sem==8){
               Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
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

          if (!req.files) {
            console.log("Sending mails without attachment");
            var mailOptions = {
                from: 'GEC Modasa <fygecmodasa@gmail.com>',
                to: Email,
                subject: sub,
                text: content,
            };

            list_of_id.forEach(function(id) {
              Students.findById(id,(err,stud ) => {
                var notif_object = {sub:req.body.sub,content:req.body.msg,date_time:date_time()}
                stud.notifications.push(notif_object)
                stud.save();
              });
            });
           transporter.sendMail(mailOptions, function(error, info) {
             if(error) {
               console.log(error)
               failure_email.push(Email);
             } else {
               self.status = true;
               success_email.push(Email);
             }
           });
         } else {

          var attachementList = [];
          for (var i = 0; i < req.files.length; i++) {
            attachementList.push({
              filename: req.files[i].originalname,
              path: req.files[i].path
            })
          }
           console.log("Sending mails with attachments.");
           console.log("req.files :- ",req.files);

            var mailOptions = {
                from: 'GEC Modasa <fygecmodasa@gmail.com>',
                to: Email,
                subject: sub,
                text: content,
                attachments:attachementList
            };
            list_of_id.forEach(function(id) {
              Students.findById(id,(err,stud ) => {
                var notif_object = {sub:req.body.sub,content:req.body.msg,attachments:attachementList,date_time:date_time()}
                stud.notifications.push(notif_object)
                stud.save();
              });
            })
            console.log("yes got here findallyyy...........");
            console.log(req.user.username);
            User.findOne({username:req.user.username},function(err,user){
              console.log("yes got here findallyyy...........",user);

              var notif_object = {sub:req.body.sub,content:req.body.msg,attachments:attachementList,date_time:date_time()}
              user.notifications.push(notif_object)
              user.save(function(err){});
            })
           transporter.sendMail(mailOptions, function(error, info) {
             if(error) {
               console.log(error)
               failure_email.push(Email);
             } else {
               self.status = true;
               success_email.push(Email);
             }
           });
          }

       },
     ]);
    }

    new massMailer(); //lets begin

       //====================================================================

     });//.find
}//fi eventoption==instant

else if(req.body.eventoption=="timedriven"){
console.log(req.body.eventoption);
  var d =[],
  d = (req.body.dt).split("-",3),
  d1=(d[2].split("T",2))[0],
  t =(((req.body.dt).split("-",3))[2].split("T",2))[1].split(":",2);
  var date = new Date(d[0], d[1]-1, d1, t[0], t[1], 0);
   sem = (req.body.year).trim();
Students.find().lean().exec(function(err,data){
  //////////////finding list of email//////////////////////////
  listofemails=[]
  list_of_id=[]
if(req.body.branch=="all"){
 console.log("all");
 console.log(sem);
 if(sem=="all"){
   data.forEach(elem=>{
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
   });//data.foreach
 }//all sem
 else{

   if(sem=="first"){
     data.forEach(elem=>{
     if(elem.cur_sem==1||elem.cur_sem==2){
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
     }
       });//data.forEach
   }else if(sem=="second"){
     data.forEach(elem=>{
     if(elem.cur_sem==3||elem.cur_sem==4){
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
     }
       });//data.forEach
   }else if(sem=="third"){
     data.forEach(elem=>{
     if(elem.cur_sem==5||elem.cur_sem==6){
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
     }
       });//data.forEach

   }else if(sem=="fourth"){
     data.forEach(elem=>{
     if(elem.cur_sem==7||elem.cur_sem==8){
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
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
     if(elem.basic.branch==req.body.branch){
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
     }
   });//data.foreach
 }//all sem
 else{
   data.forEach(elem=>{
     if(elem.basic.branch==req.body.branch){
   if(sem=="first"){
     if(elem.cur_sem==1||elem.cur_sem==2){
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
     }

   }else if(sem=="second"){
     if(elem.cur_sem==3||elem.cur_sem==4){
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
     }

   }else if(sem=="third"){
     if(elem.cur_sem==5||elem.cur_sem==6){
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
     }

   }else if(sem=="fourth"){
     if(elem.cur_sem==7||elem.cur_sem==8){
       Create_List_of_emails(elem.basic.email);
               Create_List_of_id(elem._id);
     }
   }
 }//Branch
});//data.foreach
 }//else all sem
}//else specific
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  ///////preparing job schedule//////////////////////////////
   schedule.scheduleJob(date, function(){
    ////////////////preparing mail event///////
    var to,sem,sub,content;
          sub=req.body.sub;
          content=req.body.msg;
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

      if (!req.file) {
        var mailOptions = {
            from: 'GEC Modasa <fygecmodasa@gmail.com>',
            to: Email,
            subject: sub,
            text: content
        }
        var notif_object = {sub:req.body.sub,content:req.body.msg};
        list_of_id.forEach(function(id) {
          Students.findById(id,(err,stud ) => {
            var notif_object = {sub:req.body.sub,content:req.body.msg,date_time:date_time()};
            stud.notifications.push(notif_object)
            stud.save();
          });
        })
        console.log("yes got here findallyyy...........");
        User.findOne({username:req.body.username},function(err,user){
          console.log("yes got here findallyyy...........",user);
        })
       transporter.sendMail(mailOptions, function(error, info) {
         if(error) {
           console.log(error)
           failure_email.push(Email);
         } else {
           self.status = true;
           success_email.push(Email);
         }
       });
      } else {

        var attachementList = [];
        for (var i = 0; i < req.files.length; i++) {
          attachementList.push({
            filename: req.files[i].originalname,
            path: req.files[i].path
          })
        }
         console.log("false is running");
         console.log("req.files :- ",req.files);

        var mailOptions = {
            from: 'GEC Modasa <fygecmodasa@gmail.com>',
            to: Email,
            subject: sub,
            text: content,
            attachments:attachementList
        };

        list_of_id.forEach(function(id) {
          Students.findById(id,(err,stud ) => {
            var notif_object = {sub:req.body.sub,content:req.body.msg,attachments:attachementList,date_time:date_time()};
            stud.notifications.push(notif_object)
            stud.save();
          });
        })
       transporter.sendMail(mailOptions, function(error, info) {
         if(error) {
           console.log(error)
           failure_email.push(Email);
         } else {
           self.status = true;
           success_email.push(Email);
         }
       });
      }

    },
  ]);
 }

 new massMailer(); //lets begin
    ///////////////////////////////////////////
  });//schedule.job
  //////////////////////////////////////////////////////////
});//students.find



}//fi eventoption==timedriven



       //===============================================================


  ////////////////////////////////////////////////////////////////////////////////
  res.render("./admin/notify.ejs")

})
//=============================================================================
//                       GET route
//=============================================================================
router.get("/notify",authFunctions.isLoggedIn,function(req,res){
  res.render("./admin/notify.ejs")
})

function Create_List_of_emails(email) {
  if (!email) {
  } else {
    listofemails.push((email).trim());
  }
}

function Create_List_of_id(id) {
  if (!id) {
  } else {
    list_of_id.push(id);
  }
}

function date_time() {
  var objToday = new Date(),
  	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
  	dayOfWeek = weekday[objToday.getDay()],
  	domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
  	dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
  	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
  	curMonth = months[objToday.getMonth()],
  	curYear = objToday.getFullYear(),
  	curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
  	curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
  	curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
  	curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
  var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
  return today
}
module.exports = router;
