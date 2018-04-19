var mongoose = require('mongoose'),
    express  = require('express'),
    mongoXlsx = require("mongo-xlsx"),
    bodyParser = require("body-parser"),
    multer    = require("multer"),
    Students  = require('../models/student');

//=========================================================
//=============== isLoggedIn function======================
//=========================================================
//authenticating if user is loggedin or not
function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()){
    console.log("user is logged in");
    return next();
  }
  console.log("user is not logged in");
    res.redirect("/login");
}

//=========================================================
//================== isAdmin function =====================
//=========================================================
function isAdmin(req,res,next) {
  console.log(req.user.username);
  if (req.isAuthenticated()){
     console.log("isAdmin: user is logged in");
    User.findOne({'username':req.user.username},function (err,data) {
      if (err) {
        console.log("findOne error");
        console.log(err);
      } else if(data.role=='admin'){
        console.log(data.role);
        return next();
      }else{res.redirect("/login");}
    })
  }else{
    console.log("isAdmin: is authenticated is false");
      res.redirect("/login");
  }
}
//=========================================================
//================== isUser function =====================
//=========================================================
function isUser(req,res,next) {
  console.log(req.user.username);
  if (req.isAuthenticated()){
     console.log("isAdmin: user is logged in");
    User.findOne({'username':req.user.username},function (err,data) {
      if (err) {
        console.log("findOne error");
        console.log(err);
      } else if(data.role=='user'){
        console.log(data.role);
        return next();
      }else{res.redirect("/login");}
    })
  }else{
    console.log("isUser: is authenticated is false");
      res.redirect("/login");
  }
}


module.exports.isLoggedIn = isLoggedIn;
module.exports.isAdmin = isAdmin;
module.exports.isUser = isUser;
