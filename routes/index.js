//=====================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    mongoXlsx = require("mongo-xlsx"),
    bodyParser = require("body-parser"),
    multer    = require("multer"),
    storage = multer.diskStorage(
      {
        destination: function (req, file, cb) {cb(null, 'uploads/')},
        filename: function (req, file, cb) {cb(null, file.originalname)}
      });
var upload = multer({ storage: storage }),
    router      = express.Router();
var flatten = require('flat');
//==============================================================================
//==================== defining sync.do ========================================
//=============================================================================
var sync = {
    _deasync: require('deasync'),
    _done: false,
    do: function(callback, sleep) {
        this._done = false;
        callback();
        while ( ! this._done) {
            this._deasync.sleep(sleep ? sleep : 100);
        }
    },
    done: function() {
        this._done = true;
    }
}
//===============================================================================
//======================= Accuring internal module =============================
//===============================================================================
var Students   = require("../models/student");
var model=null;
var validate     = require('../validation/insertValidate');
//======================================
// GET Route
//======================================
router.get("/",isLoggedIn,function(req,res){
  res.render("index.ejs");
})
//======================================
// PoST Route
//======================================
router.post("/",upload.single("file"),function (req,res){
  console.log("File Path:",req.file.path);
  console.log("File Category:",req.body.fc);
  var model = null;
sync.do(function(){
//=========================================================================
  mongoXlsx.xlsx2MongoData("./"+req.file.path,model,function (err,mongoData) {
    //======================== basic Detail D2D ================================
    //==========================================================================
    if(req.body.fc=="basic2"){
      console.log("basic uploaded");
      mongoData.forEach(elem=>{
      if(validate.enrollmentFormat(elem['Enrollment No.'])){
        Students.findById(elem['Enrollment No.'],function (err,data) {
          if(err){
            console.log("element can't fiound");
          }
          else{
      var obj = {
      start_sem     :3,
      cur_sem       :3,
      detain        :false,
      _id           :    elem['Enrollment No.'],
      basic:{
      course:  elem['course'],
      name:  elem['name'],
      age:  elem['age'],
      gender:  elem['gender'],
      category:  elem['category'],
      mode_of_adm:  elem['mode_of_adm'],
      mob_no:  elem['mob_no'],
      email:  elem['email'],
      add_t:  elem['add_t'],
      add_p:  elem['add_p'],
      tfw:  elem['tfw'],
      branch:  elem['branch'],
      dob:  elem['dob'],
      division:  elem['division'],
      city:  elem['city'],
      district:  elem['district'],
      state:  elem['state'],
      pincode:  elem['pincode']
    }
    };
    Students.create(obj,function (err,data) {
      if (err) {
        console.log("New basic enty error",_id,err);
      } else {
        console.log("created basic details of ",data);

      }
    });
  }//esle
})
       }
      })
    }



    //======================== basic detail Regular      =======================
    //==========================================================================
    if(req.body.fc=="basic1"){
      console.log("basic uploaded");
      mongoData.forEach(elem=>{
      if(validate.enrollmentFormat(elem['Enrollment No.'])){
        Students.findById(elem['Enrollment No.'],function (err,data) {
          if(err){
            console.log("element can't fiound");
          }
          else{
      var obj = {
      start_sem     :1,
      cur_sem       :1,
      detain        :3,
      _id           :    elem['Enrollment No.'],
      basic:{
      course:  elem['course'],
      name:  elem['name'],
      age:  elem['age'],
      gender:  elem['gender'],
      category:  elem['category'],
      mode_of_adm:  elem['mode_of_adm'],
      mob_no:  elem['mob_no'],
      email:  elem['email'],
      add_t:  elem['add_t'],
      add_p:  elem['add_p'],
      tfw:  elem['tfw'],
      branch:  elem['branch'],
      dob:  elem['dob'],
      division:  elem['division'],
      city:  elem['city'],
      district:  elem['district'],
      state:  elem['state'],
      pincode:  elem['pincode']
    }
    };
    Students.create(obj,function (err,data) {
      if (err) {
        console.log("New basic enty error",_id,err);
      } else {
        console.log("created basic details of ",data);
      }
    });
  }//esle
})
       }
      })
    }

    //==========================For TERM FEES =========================
    if (req.body.fc=="TFee") {
      console.log("Excel of Termfee is uploaded");
      mongoData.forEach(elem => {

        if(validate.enrollmentFormat(elem['Enrollment No.'])){
          Students.findById(elem['Enrollment No.'],function (err,data) {
          if (err) {
            console.log(err);
          }
          else {
              if (!data) {
                console.log("No pre existing data found of enrollment no.:"+_id);
              }
              else {

                var _id     = elem['Enrollment No.'],
                    cur_sem = elem.Semester,
                    sem     = "s_"+elem.Semester,
                    a1      =+elem['Govt. Education fees']||0,
                    a2      =+elem['Govt. Workshop-Lab Fees']||0,
                    a3      =+elem['Govt. Library Fees']||0,
                    a4      =+elem['Govt. Locker Fees']||0 ,
                    a5      =+elem['Non- Govt. Gymkhana Fees']||0,
                    a6      =+elem['Non- Govt. Internal Exam fees']||0,
                    a7      =+elem['Exam Fees']||0,
                    total   = a1+a2+a3+a4+a5+a6+a7;
                var obj = {cur_sem:cur_sem,[sem]:{Term_fee:total}} ;
                Students.findByIdAndUpdate(_id,flatten(obj),{overwrite:false},function(err,updatedData){
                  if (err) { console.log("updating term fee error ",err);}
                  else     { console.log("updated data: "+updatedData); }
                })
              }
          }
        })
      }
      });
    }
    //============================= Term Fees Over =================================
    //===============================================================================
    //++++++++++++++++++++++++++++++For Marksheet ================================== #2
    else if (req.body.fc=="result"){
      console.log("result uploading initiated");
      mongoData.forEach(elem=>{
        if(validate.enrollmentFormat(elem['Enrollment No.'])){
          Students.findById(elem['Enrollment No.'],function(err,data){
            if(err){
              console.log("searching error :",err);
            }
            else{
              console.log("preparing marksheet object");



            }
          })
        }
      })
    }

    //++++++++++++++++++++++++++++++ Marksheet Over================================== #2
    //===============================================================================
    //=============================For Exam Fees  ===================================
    else if (req.body.fc=="EFee") {
        console.log("Excel of Exam fee uploaded");
        mongoData.forEach(elem =>{

          if(validate.enrollmentFormat(elem['Enrollment No.'])){
          Students.findById(elem['Enrollment No.'],function(err,data){
            if(err){
              console.log("searchingtime error :",err);
            }
            else{

                console.log("data foud in excel");
                if(!data){
                console.log("no pre existing data of Enrollment no.: ",elem['Enrollment No.']);
                }
                else{
                console.log("data existed");
                var _id    = elem['Enrollment No.'],
                    type   = elem['Exam Type'],
                    a1     = +elem['Exam Fee as per form']||0,
                    a2     = +elem['Late Fee if any']||0,
                    total  = a1 +a2,
                    sem    = "s_"+elem['Current Semester'],
                    obj    = {},
                    wholeField={};
                if(data.detain == true ){

                    sem    = "d_"+elem['Current Semester'];
                    obj    = {[sem]:{Exam_fee_Rem:total}};
                }
                else{
                  if(type=="Regular"){

                     obj    = {[sem]:{Exam_fee_Reg:total}};
                     console.log("reg obj");
                  }
                  else if(type=="Remedial"){
                     obj    = {[sem]:{Exam_fee_Rem:total}};
                     console.log("rem obj");

                  }
                  console.log("=>",obj);
                 Students.findByIdAndUpdate(_id,flatten(obj),{overwrite:false},function(err, updatedItem){
                    if(err){
                      console.log("updating error",err);
                    }
                    else{
                      console.log("updated",updatedItem);
                    }
                  })
                }
              }
          }
          })
        }
        })
    }
    //======================================================================
  sync.done();
  })//mongoXlsx

//==========================================================================
})//sync close
//=========================================================================
//=========================================================================
//=========================================================================
   if(validate.isError()){

     res.redirect("/error");
      }
   else{

     res.redirect("/");
   }
//==================================================================================

})

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




module.exports = router;
