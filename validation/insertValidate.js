var mongoose = require('mongoose'),
    express  = require('express'),
    mongoXlsx = require("mongo-xlsx"),
    bodyParser = require("body-parser"),
    multer    = require("multer"),
    Students  = require('../models/student');

var error =[];

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
  enrollmentFormat : function(enrollment){
  
    if(Number.isInteger(enrollment) ){

        console.log("typechecked");
      if(enrollment.toString().length==12){
      return true;
      }
      else{
        error.push(enrollment+"_not equal to 12 digit");
        console.log("pushed");
        return false;
      }
    }
    else{
      error.push(enrollment+"_not integer format")
      return false;
    }
  },
  isError : function(){
    console.log("is error called");
    if(error.length!=0)
      return true;
      return false;
  },
  toEmptyError : function(){
    console.log("empty error called");
    var errorList = error;
    error=[];
    return errorList;
  }

}
