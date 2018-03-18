//=====================Importing all dependencies============
var mongoose        = require('mongoose'),
    express         = require('express'),
    mongoXlsx       = require("mongo-xlsx"),
    bodyParser      = require("body-parser"),
    multer          = require("multer"),
    storage         = multer.diskStorage(
      {
        destination: function (req, file, cb) {cb(null, 'uploads/')},
        filename: function (req, file, cb) {cb(null, file.originalname)}
      }),
     upload        = multer({ storage: storage }),
     router        = express.Router(),
     flatten       = require('flat');

    //==============================================================================
    //==================== Importin auth dependencies ==============================
    //=============================================================================
var passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("../models/user"),
    TempUser              = require("../models/tempUser"),
    expressSession        = require("express-session"),
    authFunctions         = require('../validation/authFunctions');

    //====================================================
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser()); // it reades, decodes information in session,encodes it
    passport.deserializeUser(User.deserializeUser());
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
var Students          = require("../models/student");
var model=null;
var validate          = require('../validation/insertValidate');
var authFunctions     = require('../validation/authFunctions');
// var isLoggedIn     = require('../validation/authFunctions');
//======================================
// GET Route
//======================================
router.get("/",authFunctions.isLoggedIn,function(req,res){
  res.render("index.ejs");
})
//======================================
// PoST Route
//======================================
router.post("/",authFunctions.isLoggedIn,upload.single("file"),function (req,res){
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
      if(validate.enrollmentFormat(elem['ENROLMENT'])){
        Students.findById(elem['ENROLMENT'],function (err,data) {
          if(err){
            console.log("element can't fiound");
          }
          else{
              var obj = {
                    start_sem     :3,
                    cur_sem       :3,
                    detain        :false,
                    _id           :elem['ENROLMENT'],
                    basic:{course:"B.E."}
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



    //======================== basic detail Regular  ===========================
    //==========================================================================
    if(req.body.fc=="basic1"){
      console.log("basic uploaded");
      mongoData.forEach(elem=>{
      if(validate.enrollmentFormat(elem['ENROLMENT'])){
        var enrol  = elem['ENROLMENT'];
        var reversed_enrol = reverse_a_number(enrol);
        Students.findById(enrol,function (err,data) {
          if(err){
            console.log("element can't fiound");
          }
          else{
      var obj = {

      _id           :    enrol,
      start_sem     :1,
      cur_sem       :1,
      detain        :false,
      basic:{course:"B.E."}
    };
    Students.create(obj,function (err,data) {
      if (err) {
        console.log("New basic enty error");
      } else {
        console.log("created basic details of ",data);
        User.register(new User({username:enrol,role:"student"}),reversed_enrol,function(err,user){})
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
        if(validate.enrollmentFormat(elem['MAP_NUMBER'])){
          Students.findById(elem['MAP_NUMBER'],function(err,data){
            if(err){
              console.log("searching error :",err);
            }//student.find by id call back if
            else{
              console.log("preparing marksheet object");
              var _id = elem['MAP_NUMBER'],
                  sem = "s_"+elem.sem,
                  subjectstring="",
                  resultstring = data[sem].result.res,
                  obj={};

              //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
              //============   object creation ============================
              obj={
                total_back:elem.TOTBACKL,
                      cpi:elem.CPI,
                      cgpa:elem.CGPA,
                      backs:{},
                      s_1:{result:{sub1:{},sub2:{},sub3:{},sub4:{},sub5:{},sub6:{},sub7:{},sub8:{},sub9:{},sub10:{}}},
                      s_2:{result:{sub1:{},sub2:{},sub3:{},sub4:{},sub5:{},sub6:{},sub7:{},sub8:{},sub9:{},sub10:{}}},
                      s_3:{result:{sub1:{},sub2:{},sub3:{},sub4:{},sub5:{},sub6:{},sub7:{},sub8:{},sub9:{},sub10:{}}},
                      s_4:{result:{sub1:{},sub2:{},sub3:{},sub4:{},sub5:{},sub6:{},sub7:{},sub8:{},sub9:{},sub10:{}}},
                      s_5:{result:{sub1:{},sub2:{},sub3:{},sub4:{},sub5:{},sub6:{},sub7:{},sub8:{},sub9:{},sub10:{}}},
                      s_6:{result:{sub1:{},sub2:{},sub3:{},sub4:{},sub5:{},sub6:{},sub7:{},sub8:{},sub9:{},sub10:{}}},
                      s_7:{result:{sub1:{},sub2:{},sub3:{},sub4:{},sub5:{},sub6:{},sub7:{},sub8:{},sub9:{},sub10:{}}},
                      s_8:{result:{sub1:{},sub2:{},sub3:{},sub4:{},sub5:{},sub6:{},sub7:{},sub8:{},sub9:{},sub10:{}}}
              };

             if(resultstring != "FAIL"){
               console.log("fail");
                for(var i=1;i<=8;i++){
                       obj.backs["s_"+i]=elem["BCK"+i],
                       obj[sem].result["sub"+i].code       = +elem["SUB"+i]||null;
                       obj[sem].result["sub"+i].name       = elem["SUB"+i+"NA"]   = elem["SUB"+i+"NA"]||null;
                       obj[sem].result["sub"+i].sub_grade  = elem["SUB"+i+"GR"]   = elem["SUB"+i+"GR"]||null;
                       obj[sem].result["sub"+i].absent     = elem["SUB"+i+"AB"]   = elem["SUB"+i+"AB"]||null;
                       obj[sem].result["sub"+i].these      = elem["SUB"+i+"GRE"]  = elem["SUB"+i+"GRE"]||null;
                       obj[sem].result["sub"+i].thpa       = elem["SUB"+i+"GRM"]  = elem["SUB"+i+"GRM"]||null;
                       obj[sem].result["sub"+i].thtot      = elem["SUB"+i+"GRTH"] = elem["SUB"+i+"GRTH"]||null;
                       obj[sem].result["sub"+i].prese      = elem["SUB"+i+"GRV"]  = elem["SUB"+i+"GRV"]||null ;
                       obj[sem].result["sub"+i].prtot      = elem["SUB"+i+"GRPR"] = elem["SUB"+i+"GRPR"]||null;
                       obj[sem].result["sub"+i].prpa       = elem["SUB"+i+"GRI"]  = elem["SUB"+i+"GRI"]||null;

                }
             }//fifail
             else{
               for(var i=1;i<=8;i++){
                     obj.backs["s_"+i]=elem["BCK"+i]
               }
               for(var i=1;i<= data.backs[sem];i++){
                      subjectstring = "SUB"+i;
                      for(j=1;j<=data[sem].Tsubject;j++){
                        if(elem[subjectstring]==data[sem].result["sub"+j].code){
                          obj[sem].result["sub"+j].code       = +elem["SUB"+i]||null;
                          obj[sem].result["sub"+j].name       = elem["SUB"+i+"NA"]   = elem["SUB"+i+"NA"]||null;
                          obj[sem].result["sub"+j].sub_grade  = elem["SUB"+i+"GR"]   = elem["SUB"+i+"GR"]||null;
                          obj[sem].result["sub"+j].absent     = elem["SUB"+i+"AB"]   = elem["SUB"+i+"AB"]||null;
                          obj[sem].result["sub"+j].these      = elem["SUB"+i+"GRE"]  = elem["SUB"+i+"GRE"]||null;
                          obj[sem].result["sub"+j].thpa       = elem["SUB"+i+"GRM"]  = elem["SUB"+i+"GRM"]||null;
                          obj[sem].result["sub"+j].thtot      = elem["SUB"+i+"GRTH"] = elem["SUB"+i+"GRTH"]||null;
                          obj[sem].result["sub"+j].prese      = elem["SUB"+i+"GRV"]  = elem["SUB"+i+"GRV"]||null ;
                          obj[sem].result["sub"+j].prtot      = elem["SUB"+i+"GRPR"] = elem["SUB"+i+"GRPR"]||null;
                          obj[sem].result["sub"+j].prpa       = elem["SUB"+i+"GRI"]  = elem["SUB"+i+"GRI"]||null;
                          }
                        }
                      }
                    }//esle fail
              //-------------------- Object created ---------------------------
              //--------------------------------------------------------------
              Students.findByIdAndUpdate(_id,flatten(obj),{overwrite:false},function(err, updatedItem){
                 if(err){
                   console.log("updating error",err);
                 }
                 else{
                   console.log("updated",updatedItem);
                 }
               })
               //======================= object updated ======================
            }//student.find by id call back else
          })//student.find by id
        }//fivalidate enroll
      })//mongoData.foreach
      //====================== finally after updating whole marksheet calculating and updating detain over whole database ===
      Students.find(function(err,collection){
        collection.forEach(doc=>{
          var obj={},
              year=0,
              kt =0;
              for(var i=1;i<doc.cur_sem;i++){
                kt = kt + doc.backs["s_"+i];
              }
              if(kt>4){
                   obj.detain = true;
                   year = (doc.cur_sem==3 || doc.cur_sem==4) ? 2 :(doc.cur_sem==5 || doc.cur_sem==6) ? 3 : 4 ;
                   obj.detain_history.push(year);
                   obj.cur_sem = doc.cur_sem+1;
              }//fi kt
              else{
                obj.cur_sem = doc.cur_sem+1;
              }
              Students.findByIdAndUpdate(doc._id,flatten(obj),{overwrite:false},function(err, updatedItem){
                 if(err){
                   console.log("updating error",err);
                 }
                 else{
                   console.log("updated",updatedItem);
                 }
               })//find and update
        })//collection.forEach
      })//studentsfind
      //============================ detain currnt sem updated ===========================================================
    }//req.body

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

                    sem    = "D_"+elem['Current Semester'];
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
//=========================================================================
//==================== function to Reverse a number =======================
//=========================================================================
function reverse_a_number(n)
{
	n = n + "";
	return n.split("").reverse().join("");
}




module.exports = router;
