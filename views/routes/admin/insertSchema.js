//=================================Importing all dependencies============
var mongoose    = require('mongoose'),
    express     = require('express'),
    mongoXlsx   = require("mongo-xlsx"),
    bodyParser  = require("body-parser"),
    multer      = require("multer"),
    Scheme      = require('../../models/Scheme'),
    keys        = require('all-object-keys'),
    get         = require('get-value'),
    router      = express.Router();


    router.get("/insertSchema",authFunctions.isLoggedIn,function(req,res){
      res.render("./admin/insertSchema.ejs")
    })
    router.post("/insertSchema",authFunctions.isLoggedIn,function(req,res){
      console.log("post insertSchema");


      var
      name             =req.body.name ;
      category         =req.body.category     ?  req.body.category    :null,
      gender           =req.body.gender       ?  req.body.gender      :null ,
      income           =req.body.income       ?  req.body.income      :0  ,
      incomeCondition  =req.body.cond         ?  req.body.cond        :null ,
      marks            =req.body.marks        ?  req.body.marks       :0  ,
      year             =req.body.yearofstudy  ?  req.body.yearofstudy :"all" ,
      residency        =req.body.residency    ?  req.body.residency   :null;
      var obj={ name:name ,
       category:category ,
       gender:gender ,
       income:income ,
       incomeCondition:incomeCondition ,
       marks:marks ,
       year: year,
       residency:residency };
    console.log(obj);
    Scheme.create(obj,function(err,data){
      if(err)
      {
        console.log(err);
      }
      else{
        console.log("done");
      }
    });
      res.redirect("./insertSchema")
    })


    router.get("/modifyscheme",authFunctions.isLoggedIn,function(req,res){
      console.log("requesting");
      Scheme.find(function(err,data){
        res.render("./admin/modifyscheme.ejs",{data:data});
      })

    })

    router.post("/modifyscheme",authFunctions.isLoggedIn,function(req,res){
      console.log("post modifyscheme");
      if(req.body.delete=="delete"){
        Scheme.findOneAndRemove({_id:req.body.id} ,function(err,data){
          if(data){
            console.log("removed");
            res.redirect("./modifyscheme");
          }
        })
      }//fi
      else if(req.body.edit=="edit"){
        Scheme.find({_id:req.body.id},function(err,data){
          if(data){
            console.log("log",data[0]._id);
            res.render("./admin/editscheme.ejs",{data:data[0]});
          }
        })
      }//fiel
    })//router

    //   router.post("/editscheme",authFunctions.isLoggedIn,function(req,res){
    //     console.log("requesting");
    //     Scheme.find(function(err,data){
    //       res.render("./admin/editscheme.ejs",{data:data});
    //     })
    // })

    router.post("/updatescheme",authFunctions.isLoggedIn,function(req,res){
      console.log("post updatescheme");
      var
      id               =req.body.id
      name             =req.body.name ;
      category         =req.body.category     ?  req.body.category    :null,
      gender           =req.body.gender       ?  req.body.gender      :null ,
      income           =req.body.income       ?  req.body.income      :0  ,
      incomeCondition  =req.body.cond         ?  req.body.cond        :null ,
      marks            =req.body.marks        ?  req.body.marks       :0  ,
      year             =req.body.yearofstudy  ?  req.body.yearofstudy :"all" ,
      residency        =req.body.residency    ?  req.body.residency   :null;
      var obj={ _id:req.body.id,
        name:name ,
       category:category ,
       gender:gender ,
       income:income ,
       incomeCondition:incomeCondition ,
       marks:marks ,
       year: year,
       residency:residency };
      Scheme.findByIdAndUpdate({_id:req.body.id},obj,function(err,data){
        res.render("./admin/editscheme.ejs",{data:data});
      })
  })


module.exports = router;
