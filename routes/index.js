//=====================Importing all dependencies============
var mongoose = require('mongoose'),
    express  = require('express'),
    mongoXlsx = require("mongo-xlsx"),
    bodyParser = require("body-parser"),
    multer    = require("multer"),
    Students  = require('../models/student'),
    storage = multer.diskStorage(
      {
        destination: function (req, file, cb) {cb(null, 'uploads/')},
        filename: function (req, file, cb) {cb(null, file.originalname)}
      });
var upload = multer({ storage: storage }),
    router      = express.Router();

//===============================================================================
//======================= Accuring Schemas ======================================
//===============================================================================
var Students   = require('../models/student');
var model=null;


//======================================
// GET Route
//======================================
router.get("/",function(req,res){
  res.render("index.ejs")
})


//======================================
// PoST Route
//======================================
router.post("/",upload.single("file"),function (req,res){
  console.log("File Path:",req.file.path);
  console.log("File Category:",req.body.fc);
  var model = null;
  mongoXlsx.xlsx2MongoData("./"+req.file.path,model,function (err,mongoData) {

      // console.log(mongodata);

    //==========================For TERM FEES =========================
    if (req.body.fc=="TFee") {
      console.log("Excel of Termfee is uploaded");
      mongoData.forEach(elem => {
         // console.log(elem);
        var _id     = elem['Enrollment No.'],
            cur_sem = elem.Semester,
            sem     = "s_"+elem.Semester,

            total  = +elem['Govt. Education fees']||0 + +elem['Govt. Workshop-Lab Fees']||0 +
                      +elem['Govt. Library Fees']||0 + +elem['Govt. Locker Fees']||0 +
                      +elem['Non- Govt. Gymkhana Fees']||0 + +elem['Non- Govt. Internal Exam fees']||0 +
                      +elem['Exam Fees']||0;
        var obj = {[sem]:{Term_fee:total}}  //<<<<========To be noted
        var obj1 = {_id,cur_sem:cur_sem,[sem]:{Term_fee:total}}  //<<<<========To be noted
        console.log("Term fees data of enrollment:"+_id+" fetched");
        Students.findById(_id,function (err,data) {
          if (err) {
            console.log("routes/index.js line 60 error");
            console.log(err);
          } else {
              if (!data) {
                console.log("No pre existing data found of enrollment no.:"+_id);
                Students.create(obj1); //<<===Temporary for testing purpose
              } else {
                console.log("routes/index.js line 67 ");
                Students.findByIdAndUpdate(_id,{$set:obj},{new:true},function(err,updatedData){
                  if (err) {
                    console.log("routes/index.js line 70 err",err);

                  } else {
                    console.log("updated data: "+updatedData);
                  }
                })
              }
          }
        })
      });
    }
    //============================= Term Fees Over ===============================
    //++++++++++++++++++++++++++++++For Marksheet ================================== #2
    else if (req.body.fc=="result") {
      console.log("Excel of Marksheet is uploaded");
      mongoData.forEach(elem => {

        var sem ="s_"+elem.sem,
            csem =elem.sem +1,
            abs = +elem.BCKAB||0,
            obj = {     _id:elem.MAP_NUMBER,
                        cur_sem:csem,
                        total_back:elem.TOTBACKL,
                        cpi:elem.CPI,
                        cgpa:elem.CGPA,
                        backs:{
                          sem1:elem.BCK1,
                          sem2:elem.BCK2,
                          sem3:elem.BCK3,
                          sem4:elem.BCK4,
                          sem5:elem.BCK5,
                          sem6:elem.BCK6,
                          sem7:elem.BCK7,
                          sem8:elem.BCK8
                        },
                        [sem]:{
                          Tsubject:elem.TOTSUBCOUNT,
                          result:{
                            spi:elem.SPI,
                            res:elem.RESULT,

                           sub1:{
                             code:elem.SUB1,
                             name:elem.SUB1NA,
                             sub_grade:elem.SUB1GR,
                             absent:abs,
                             these:elem.SUB1GRE,
                             thpa:elem.SUB1GRM,
                             thtot:elem.SUB1GRTH,
                             prese:elem.SUB1GRV,
                             prpa:elem.SUB1GRI,
                             prtot:elem.SUB1GRPR
                           },
                           sub2:{
                             code:elem.SUB2,
                             name:elem.SUB2NA,
                             sub_grade:elem.SUB2GR,
                             absent:abs,
                             these:elem.SUBG2RE,
                             thpa:elem.SUB2GRM,
                             thtot:elem.SUB2GRTH,
                             prese:elem.SUB2GRV,
                             prpa:elem.SUB2GRI,
                             prtot:elem.SUB2GRPR
                           },
                           sub3:{
                             code:elem.SUB3,
                             name:elem.SUB3NA,
                             sub_grade:elem.SUB3GR,
                             absent:abs,
                             these:elem.SUB3GRE,
                             thpa:elem.SUB3GRM,
                             thtot:elem.SUB3GRTH,
                             prese:elem.SUB3GRV,
                             prpa:elem.SUB3GRI,
                             prtot:elem.SUB3GRPR
                           },
                           sub4:{
                             code:elem.SUB4,
                             name:elem.SUB4NA,
                             sub_grade:elem.SUB4GR,
                             absent:abs,
                             these:elem.SUB4GRE,
                             thpa:elem.SUB4GRM,
                             thtot:elem.SUB4GRTH,
                             prese:elem.SUB4GRV,
                             prpa:elem.SUB4GRI,
                             prtot:elem.SUB4GRPR
                           },
                           sub5:{
                             code:elem.SUB5,
                             name:elem.SUB5NA,
                             sub_grade:elem.SUB5GR,
                             absent:abs,
                             these:elem.SUB5GRE,
                             thpa:elem.SUB5GRM,
                             thtot:elem.SUB5GRTH,
                             prese:elem.SUB5GRV,
                             prpa:elem.SUB5GRI,
                             prtot:elem.SUB5GRPR
                           },
                           sub6:{
                             code:elem.SUB6,
                             name:elem.SUB6NA,
                             sub_grade:elem.SUB6GR,
                             absent:abs,
                             these:elem.SUB6GRE,
                             thpa:elem.SUB6GRM,
                             thtot:elem.SUB6GRTH,
                             prese:elem.SUB6GRV,
                             prpa:elem.SUB6GRI,
                             prtot:elem.SUB6GRPR
                           },
                           sub7:{
                             code:elem.SUB7,
                             name:elem.SUB7NA,
                             sub_grade:elem.SUB7GR,
                             absent:abs,
                             these:elem.SUB7GRE,
                             thpa:elem.SUB7GRM,
                             thtot:elem.SUB7GRTH,
                             prese:elem.SUB7GRV,
                             prpa:elem.SUB7GRI,
                             prtot:elem.SUB7GRPR
                           },
                           sub8:{
                             code:elem.SUB8,
                             name:elem.SUB8NA,
                             sub_grade:elem.SUB8GR,
                             absent:abs,
                             these:elem.SUB8GRE,
                             thpa:elem.SUB8GRM,
                             thtot:elem.SUB8GRTH,
                             prese:elem.SUB8GRV,
                             prpa:elem.SUB8GRI,
                             prtot:elem.SUB8GRPR
                           },
                           sub9:{
                             code:elem.SUB9,
                             name:elem.SUB9NA,
                             sub_grade:elem.SUB9GR,
                             absent:abs,
                             these:elem.SUB9GRE,
                             thpa:elem.SUB9GRM,
                             thtot:elem.SUB9GRTH,
                             prese:elem.SUB9GRV,
                             prpa:elem.SUB9GRI,
                             prtot:elem.SUB9GRPR
                           },
                           sub10:{
                             code:elem.SUB10,
                             name:elem.SUB10NA,
                             sub_grade:elem.SUB10GR,
                             absent:abs,
                             these:elem.SUB10GRE,
                             thpa:elem.SUB10GRM,
                             thtot:elem.SUB10GRTH,
                             prese:elem.SUB10GRV,
                             prpa:elem.SUB10GRI,
                             prtot:elem.SUB10GRPR
                           }

                          }
                        }
                      },
              obj1 = {
                                  cur_sem:csem,
                                  total_back:elem.TOTBACKL,
                                  cpi:elem.CPI,
                                  cgpa:elem.CGPA,
                                  backs:{
                                    sem1:elem.BCK1,
                                    sem2:elem.BCK2,
                                    sem3:elem.BCK3,
                                    sem4:elem.BCK4,
                                    sem5:elem.BCK5,
                                    sem6:elem.BCK6,
                                    sem7:elem.BCK7,
                                    sem8:elem.BCK8
                                  },
                                  [sem]:{
                                    Tsubject:elem.TOTSUBCOUNT,
                                    result:{
                                      spi:elem.SPI,
                                      res:elem.RESULT,

                                     sub1:{
                                       code:elem.SUB1,
                                       name:elem.SUB1NA,
                                       sub_grade:elem.SUB1GR,
                                       absent:abs,
                                       these:elem.SUB1GRE,
                                       thpa:elem.SUB1GRM,
                                       thtot:elem.SUB1GRTH,
                                       prese:elem.SUB1GRV,
                                       prpa:elem.SUB1GRI,
                                       prtot:elem.SUB1GRPR
                                     },
                                     sub2:{
                                       code:elem.SUB2,
                                       name:elem.SUB2NA,
                                       sub_grade:elem.SUB2GR,
                                       absent:abs,
                                       these:elem.SUBG2RE,
                                       thpa:elem.SUB2GRM,
                                       thtot:elem.SUB2GRTH,
                                       prese:elem.SUB2GRV,
                                       prpa:elem.SUB2GRI,
                                       prtot:elem.SUB2GRPR
                                     },
                                     sub3:{
                                       code:elem.SUB3,
                                       name:elem.SUB3NA,
                                       sub_grade:elem.SUB3GR,
                                       absent:abs,
                                       these:elem.SUB3GRE,
                                       thpa:elem.SUB3GRM,
                                       thtot:elem.SUB3GRTH,
                                       prese:elem.SUB3GRV,
                                       prpa:elem.SUB3GRI,
                                       prtot:elem.SUB3GRPR
                                     },
                                     sub4:{
                                       code:elem.SUB4,
                                       name:elem.SUB4NA,
                                       sub_grade:elem.SUB4GR,
                                       absent:abs,
                                       these:elem.SUB4GRE,
                                       thpa:elem.SUB4GRM,
                                       thtot:elem.SUB4GRTH,
                                       prese:elem.SUB4GRV,
                                       prpa:elem.SUB4GRI,
                                       prtot:elem.SUB4GRPR
                                     },
                                     sub5:{
                                       code:elem.SUB5,
                                       name:elem.SUB5NA,
                                       sub_grade:elem.SUB5GR,
                                       absent:abs,
                                       these:elem.SUB5GRE,
                                       thpa:elem.SUB5GRM,
                                       thtot:elem.SUB5GRTH,
                                       prese:elem.SUB5GRV,
                                       prpa:elem.SUB5GRI,
                                       prtot:elem.SUB5GRPR
                                     },
                                     sub6:{
                                       code:elem.SUB6,
                                       name:elem.SUB6NA,
                                       sub_grade:elem.SUB6GR,
                                       absent:abs,
                                       these:elem.SUB6GRE,
                                       thpa:elem.SUB6GRM,
                                       thtot:elem.SUB6GRTH,
                                       prese:elem.SUB6GRV,
                                       prpa:elem.SUB6GRI,
                                       prtot:elem.SUB6GRPR
                                     },
                                     sub7:{
                                       code:elem.SUB7,
                                       name:elem.SUB7NA,
                                       sub_grade:elem.SUB7GR,
                                       absent:abs,
                                       these:elem.SUB7GRE,
                                       thpa:elem.SUB7GRM,
                                       thtot:elem.SUB7GRTH,
                                       prese:elem.SUB7GRV,
                                       prpa:elem.SUB7GRI,
                                       prtot:elem.SUB7GRPR
                                     },
                                     sub8:{
                                       code:elem.SUB8,
                                       name:elem.SUB8NA,
                                       sub_grade:elem.SUB8GR,
                                       absent:abs,
                                       these:elem.SUB8GRE,
                                       thpa:elem.SUB8GRM,
                                       thtot:elem.SUB8GRTH,
                                       prese:elem.SUB8GRV,
                                       prpa:elem.SUB8GRI,
                                       prtot:elem.SUB8GRPR
                                     },
                                     sub9:{
                                       code:elem.SUB9,
                                       name:elem.SUB9NA,
                                       sub_grade:elem.SUB9GR,
                                       absent:abs,
                                       these:elem.SUB9GRE,
                                       thpa:elem.SUB9GRM,
                                       thtot:elem.SUB9GRTH,
                                       prese:elem.SUB9GRV,
                                       prpa:elem.SUB9GRI,
                                       prtot:elem.SUB9GRPR
                                     },
                                     sub10:{
                                       code:elem.SUB10,
                                       name:elem.SUB10NA,
                                       sub_grade:elem.SUB10GR,
                                       absent:abs,
                                       these:elem.SUB10GRE,
                                       thpa:elem.SUB10GRM,
                                       thtot:elem.SUB10GRTH,
                                       prese:elem.SUB10GRV,
                                       prpa:elem.SUB10GRI,
                                       prtot:elem.SUB10GRPR
                                     }

                                    }
                                  }
                                };
        // console.log(obj.s_1.result);
        Students.findById(elem.MAP_NUMBER,function (err,data) {
          if (!data) {
            Students.create(obj); //<<== Temporary for creating data
          } else {
            Students.findOneAndUpdate(elem.MAP_NUMBER,obj1)
          }
        })


      });
    }
    //++++++++++++++++++++++++++++++ Marksheet Over================================== #2
    //=============================For Exam Fees  ===============================
    else if (req.body.fc=="EFee") {
        console.log("Excel of Exam fee uploaded");
        mongoData.forEach(elem =>{


          Students.findById(elem['Enrollment No.'],function(err,data){
            if(err){
              console.log("routes/index.js line 254 ",err);
            }
            else{
              if(!data){
                console.log("no pre existing data of Enrollment no.: ",elem['Enrollment No.']);
                var _id    = elem['Enrollment No.'],
                    type   = elem['Exam Type'],
                    total  = +elem['Exam Fee as per form']||0  + +elem['Late Fee if any']||0,
                    sem    = "s_"+elem['Current Semester'],
                    csem   = elem['Current Semester']
                    obj    = {};
                    obj    = {_id:_id, cur_sem :csem,[sem]:{Exam_fee_Reg:total}};
                    console.log("Created object: ",obj);
                Students.create(obj);
              }
              else if(data){
                console.log("inserting fee data");
                var _id    = elem['Enrollment No.'],
                    type   = elem['Exam Type'],
                    total  = +elem['Exam Fee as per form']||0  + +elem['Late Fee if any']||0,
                    sem    = "s_"+elem['Current Semester'],
                    obj    = {};
                var objReg = {[sem]:{Exam_fee_Reg:total}},
                    objRem = {[sem]:{Exam_fee_Rem:total}};
                // if(Detain(elem['Current Semester'],elem['Enrollment No.'])){
                //     sem    = "d_"+elem['Current Semester']
                // }
                // else{
                  if(type=="Regular"){
                     Students.findByIdAndUpdate(_id,{$set:objReg},function (err,updatedData) {
                       console.log("Updated data:",updatedData);
                     });
                  }
                  else if(type=="Remedial"){
                     Students.findByIdAndUpdate(_id,{$set:objRem},function (err,updatedData) {
                       console.log("Updated data:",updatedData);
                     });
                  }
                  // console.log("=>",obj);
                  // Students.findByIdAndUpdate(_id,{$set:obj},function(err, updatedItem){
                  //   if(err){
                  //     console.log("updating error",err);
                  //   }
                  //   else{
                  //     console.log("updated",updatedItem);
                  //   }
                  // })
                // }
              }
            }
          })
        })


    }

    //==========================================
  })

  res.redirect("/");
})






module.exports = router;
