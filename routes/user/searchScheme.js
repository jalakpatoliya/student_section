var mongoose    = require('mongoose'),
    express     = require('express'),
    mongoXlsx   = require("mongo-xlsx"),
    bodyParser  = require("body-parser"),
    multer      = require("multer"),
    Scheme      = require('../../models/Scheme'),
    Students     = require('../../models/student'),
    keys        = require('all-object-keys'),
    get         = require('get-value'),
    router      = express.Router();


    router.get("/searchScheme",authFunctions.isLoggedIn,function(req,res){
      res.render("./user/searchScheme.ejs",{data:null})
    })

    router.post("/searchScheme",authFunctions.isLoggedIn,function(req,res){
         var enroll = req.body.enroll;

           Students.findById(enroll,function(err,data){
             var cat=data.basic.category;
             Scheme.find( {category:{$in:[cat,"all"]} },function(err2,data2){
               console.log(data2)
               data3=[];

              // data2.forEach(elem=>{
              //    var flag=1;
              //    if(elem.gender!=null){
              //     if(elem.gender!=data.basic.gender) {
              //     flag=0
              //     }
              //    }//gender
              //
              //    if(elem.marks!=null){
              //     if(elem.year=="all" ) {
              //     }else{
              //       flag=0;
              //       if(elem.year=="one" && (data.cur_sem==1||data.cur_sem==2)){flag=1;}
              //       else if(elem.year=="two" && (data.cur_sem==1||data.cur_sem==2)){flag=1;}
              //       else if(elem.year=="three" && (data.cur_sem==1||data.cur_sem==2)){flag=1;}
              //       else if(elem.year=="four" && (data.cur_sem==1||data.cur_sem==2)){flag=1;}
              //     }
              //   }//marks
              //
              //   if(elem.income!=null){
              //     if(elem.incomeCondition!=null){
              //       if(elem.incomeCondition=="gt"){
              //         if(data.income<elem.income){
              //           flag=0;
              //         }
              //       }
              //       else if(elem.incomeCondition=="lt"){
              //         if(data.income>elem.income){
              //           flag=0;
              //         }
              //       }
              //     }
              //     else{
              //       if(data.income<elem.income){
              //         flag=0;
              //       }
              //     }
              //   }//income
              //
              //   if(flag==1){
              //     data3.push(elem);
              //   }
              //  });
              //
               res.render("./user/searchScheme.ejs",{data:data2})
             })
           });


    })
module.exports = router;
