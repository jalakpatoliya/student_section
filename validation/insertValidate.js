var mongoose = require('mongoose'),
    express  = require('express'),
    mongoXlsx = require("mongo-xlsx"),
    bodyParser = require("body-parser"),
    multer    = require("multer"),
    Students  = require('../models/student');



module.exports={
  detain : function(enrollment){
    console.log("from detain ",enrollment);
    Students.findById(enrollment,function(err,data){
      if(data){
        var csem=data.cut_sem,
            semStr={},
            kt   = 0;
        for(l1=1;l1<csem-1;l1++){
          semStr='sem'+l1;
          kt    = kt + +data.backs[semStr]||0;
        }
        if(kt>=5){
            return true;
        }
        else{
            return false;
        }
      }
    });

  },
  preexist : function(data){
    console.log("checking pre existence");
  }
}
