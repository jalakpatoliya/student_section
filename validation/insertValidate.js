var mongoose = require('mongoose'),
    express  = require('express'),
    mongoXlsx = require("mongo-xlsx"),
    bodyParser = require("body-parser"),
    multer    = require("multer"),
    Students  = require('../models/student');

var error =[];

module.exports={  
  enrollmentFormat : function(enrollment){

    if (enrollment !== undefined){
    if(Number.isInteger(enrollment) ){

        console.log("typechecked");
      if(enrollment.toString().length==12){
        console.log("format matched");
      return true;
      }
      else{
        error.push(enrollment+"=> not equal to 12 digit");
        console.log("pushed");
        return false;
      }
    }

  else{
      error.push(enrollment + "=> not integer format");
      console.log("not integer format called ",enrollment,"=====>",error);
      return false;
    }
  }
  else{
    return false;
  }
  },

  isError : function(){
    console.log("is error called");
    console.log("error list value from iserror function",error);
    if(error.length!=0)
      return true;
      return false;
  },

  toEmptyError : function(){
    console.log("empty error called");
    var errorList =[];
    errorList= error;
    error=[];
    return errorList;
  }

}
