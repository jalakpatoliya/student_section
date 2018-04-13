var express  = require('express');
var router   = express.Router();
var passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    mongoose              = require("mongoose"),
    User                  = require("../models/user"),
    TempUser              = require("../models/tempUser"),
    expressSession        = require("express-session"),
    authFunctions         = require('../validation/authFunctions');

    //====================================================
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser()); // it reades, decodes information in session,encodes it
    passport.deserializeUser(User.deserializeUser());

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
      res.redirect("/");
    })

    //=========================================================
    //============= Request for an account ====================
    //=========================================================
    router.post("/registerRequest",function (req,res) {
      TempUser.create({username:req.body.name,password:req.body.pass})
      res.redirect("/")
    })
    //=========================================================
    //============= Notifications of admin ====================
    //=========================================================
    router.get("/notifications",function(req,res){
      TempUser.find({},function(err,data){
        if (err) {
          console.log(err);
        } else {
          res.render("./admin/notifications.ejs",{data:data});
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

module.exports = router;
