//=====================Importing all dependencies============
var mongoose                  = require('mongoose'),
    express                   = require('express'),
    mongoXlsx                 = require("mongo-xlsx"),
    bodyParser                = require("body-parser"),
    multer                    = require("multer"),
    storage                   = multer.diskStorage(
                                  {
                                    destination: function (req, file, cb) {cb(null, 'uploads/')},
                                    filename: function (req, file, cb) {cb(null, file.originalname)}
                                  }),
    authFunctions             = require('../validation/authFunctions'),
    passport                  = require("passport"),
    LocalStrategy             = require("passport-local"),
    passportLocalMongoose     = require("passport-local-mongoose"),
    mongoose                  = require("mongoose"),
    User                      = require("../models/user"),
    TempUser                  = require("../models/tempUser"),
    authFunctions             = require('../validation/authFunctions'),
    cookieParser              = require('cookie-parser'),
    flash                     = require('connect-flash'),
    expressSession            = require("express-session"),
    nodemailer                = require("nodemailer"),
    async                     = require("async"),
    crypto                    = require("crypto");
var upload = multer({ storage: storage }),
    router      = express.Router();
var flatten = require('flat');
//===============================================================================
//======================= Accuring user module  =================================
//===============================================================================
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
//===============================================================================
//======================= Accuring internal module =============================
//===============================================================================
var Students   = require("../models/student");
var model=null;
var validate     = require('../validation/insertValidate');
//==============================================
//===================Using body parser==========
//==============================================
router.use(bodyParser.urlencoded({
  extended: true
}));
//======================================
// GET Route
//======================================
router.get("/edit",authFunctions.isLoggedIn,function(req,res){
  var enroll = req.query.searched_enroll;
  console.log(enroll);
  Students.findById(enroll,function (err,data) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit.ejs",{data:data});
    }
  })

})
//======================================
// PoST Route
//======================================
router.post("/edit",authFunctions.isLoggedIn,function (req,res) {
//   console.log(req.body.basic);
// //  console.log("=>",req.body.basic.mod_of_adm);
//   console.log(req.body.enroll);
  console.log("==========================");
  var obj = {basic:req.body.basic};
console.log(obj);

  Students.findByIdAndUpdate(req.body.enroll,flatten(obj),{overwrite:false},function (err,UpdatedData) {
    if (err) {
      console.log(err);
    } else {
      console.log("UpdatedData:");
      Students.findById(req.body.enroll,function (err,data) {
        if (err) {
          console.log(err);
        } else {
          res.render("show.ejs",{data:data});
        }
      })
    }
  })
})


//======================================
// GET Route For students
//======================================
router.get("/edit/student",authFunctions.isLoggedIn,function(req,res){
  var enroll = req.user.username;
  console.log(enroll);
  Students.findById(enroll,function (err,data) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit.ejs",{data:data});
    }
  })

})
//======================================
// PoST Route  students
//======================================
router.post("/edit/student",authFunctions.isLoggedIn,function (req,res) {
  console.log(req.body.basic);
  console.log(req.body.enroll);
  var obj = {basic:req.body.basic};
console.log(obj);
console.log(req.body.basic['email']);
console.log(req.user.username);
  User.findOne({username:req.user.username},function(err,user){
    console.log("INto the user:");
    console.log(user.username);
    console.log(user.role);
    user.email = req.body.basic['email'];
    user.save();
  })

  Students.findByIdAndUpdate(req.body.enroll,flatten(obj),{overwrite:false},function (err,UpdatedData) {
    if (err) {
      console.log(err);
    } else {
      console.log("UpdatedData:",UpdatedData);
      Students.findById(req.body.enroll,function (err,data) {
        if (err) {
          console.log(err);
        } else {
          res.render("show.ejs",{data:data});
        }
      })
    }
  })
})

module.exports = router;
