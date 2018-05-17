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
    expressSession        = require("express-session"),
    nodemailer            = require("nodemailer"),
    async                 = require("async"),
    crypto                = require("crypto");


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

    //=========================================================
    //============= Get Request forgot password ===============
    //=========================================================
    router.get('/forgotPassword',function(req,res){
      res.render("./student/forgotPassword.ejs")
    })
    //=========================================================
    //============= Post Request forgot password ===============
    //=========================================================
  router.post('/forgotPassword',function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgotPassword');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          type: 'OAuth2',
          user: 'fygecmodasa@gmail.com',
          clientId: '366431355006-5ut34qv0rodupqs8c4qcadge11154522.apps.googleusercontent.com',
          clientSecret: 'cVuwdxCKN-ZtMhZ037ePd6lZ',
          refreshToken: '1/i1zddoS6vhuOPHao1yoKcCKnMQW6UlxfF5yySwfYtBA'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'fygecmodasa@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.Check your mail box.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgotPassword');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgotPassword');
    }
    res.render('./student/reset.ejs', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          type: 'OAuth2',
          user: 'fygecmodasa@gmail.com',
          clientId: '366431355006-5ut34qv0rodupqs8c4qcadge11154522.apps.googleusercontent.com',
          clientSecret: 'cVuwdxCKN-ZtMhZ037ePd6lZ',
          refreshToken: '1/i1zddoS6vhuOPHao1yoKcCKnMQW6UlxfF5yySwfYtBA'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'fygecmodasa@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/welcome');
  });
});



module.exports = router;
