var express  = require('express');
var router   = express.Router();
var passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    mongoose              = require("mongoose"),
    User                  = require("../models/user"),
    TempUser              = require("../models/tempUser"),
    authFunctions         = require('../validation/authFunctions'),
    cookieParser          = require('cookie-parser'),
    flash                 = require('connect-flash'),
    expressSession        = require("express-session");

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

    //=========================================================
    //=============Login route================================
    //=========================================================
    // Render login form
    router.get("/login",function(req,res){
      res.render("login.ejs")
    })

    //login logic
    //MIDDLEWARE
    router.post("/login",passport.authenticate("local",{
      successRedirect:"/welcome",
      failureRedirect:"/login"
    }),function(req,res){console.log(req.body.username);});
    //=========================================================
    //=============Logout route================================
    //=========================================================
    router.get("/logout",function(req,res){
      req.logout();
      res.redirect("/index");
    })

    //=========================================================
    //============= Request for an account ====================
    //=========================================================
    // Render signup form
    router.get("/signup",function(req,res){
      res.render("signup.ejs")
    })
    //  Sign up logic
      router.post("/registerRequest",function (req,res) {
      TempUser.create({username:req.body.name,password:req.body.pass})
      res.redirect("/index")
    })
    //=========================================================
    //============= Notifications of admin ====================
    //=========================================================
    router.get("/notifications",function(req,res){
      TempUser.find({},function(err,data){
        if (err) {
          console.log(err);
        } else {
          var n=0;
          data.forEach(function(element){
            n=n+1;
          })
          console.log("total notifications:",n);
          res.render("./admin/notifications.ejs",{data:data,n:n});
        }
      })
    })
    //=========================================================
    //============= Notifications of admin ====================
    //=========================================================
    router.post("/notifications",function(req,res){
      console.log(req.body);
      if (req.body.delete=="delete") {
        console.log("del");
        TempUser.findOneAndRemove({username:req.body.username,password:req.body.password},function(err) {
          if (err) {
            console.log(err);
          }else {
            res.redirect("/notifications")

          }
        })
      }
      else if(req.body.add=="add") {
        console.log("add");
        User.register(new User({username:req.body.username,role:"user"}),req.body.password,function(err,user){})
        TempUser.findOneAndRemove({username:req.body.username,password:req.body.password},function(err) {
          if (err) {
            console.log(err);
          }else {
            res.redirect("/notifications")
          }
        })
      }
    })
    //=========================================================
    //=============Get Request for changing password =============
    //=========================================================
    // Render form for password change
    router.get('/changePassword',function(req,res){
      console.log("Username:",req.user.username);
      res.render("./student/changePassword.ejs");
    })
    //=========================================================
    //=============Post Request for changing password =============
    //=========================================================
    router.post('/changePassword',function(req,res){
      console.log("Username:",req.user.username);
      User.findOne({username:req.user.username},function(err,user){
        if(!user){
          req.flash('error','Failed to change the password')
          return res.redirect('/changePassword');
        }
        else {
          console.log(req.body.password);
          if (req.body.password===req.body.confirm_password) {
            console.log("password confimed");
            user.setPassword(req.body.password,function(err){
              user.save(function(err){
                req.login(user,function(err){
                  done(err,user);
                })
              })
            })
            req.flash('ui ','Password changed successfully!');
            res.redirect("/changePassword");
          }else {

            req.flash('ui','Failed to change the password');
            res.redirect('/changePassword');
          }

        }
      })
    })

module.exports = router;
