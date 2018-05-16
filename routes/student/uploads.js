//=================================Importing all dependencies============r
var mongoose = require('mongoose'),
    express  = require('express'),
    router   = express.Router(),
    Students  = require('../../models/student'), //Importing multiple models and schemas
    authFunctions = require('../../validation/authFunctions'),
    path                  = require('path'),
    crypto                = require('crypto'),
    multer                = require("multer"),
    GridFsStorage         = require('multer-gridfs-storage'),
    Grid                  = require('gridfs-stream'),
    methodOverride        = require('method-override');

// Middleware
router.use(methodOverride('_method'));
// Mongo URI
const mongoURI = 'mongodb://localhost/demo3'

// Create mongo Connnection
const conn     = mongoose.createConnection(mongoURI)

// Init gfs
let gfs;

conn.once('open',function(){
  // Init stream
   gfs = Grid(conn.db,mongoose.mongo);
   gfs.collection('uploads');
})

// Create storage engine
const storage = new  GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = req.body.fc + req.user.username + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

//****************************************************************************************
//****************************************************************************************
//****************************************************************************************

// @route GET /
// @desc Loads form
router.get("/student/uploads/pdf",function(req,res){

  gfs.files.find({filename:"E"+req.user.username+".pdf"}).toArray(function(err,files1){
      gfs.files.find({filename:"T"+req.user.username+".pdf"}).toArray(function(err,files2){
        var files = files1.concat(files2);
        // Check if files
        if (!files||files.length === 0) {
          res.render("./student/studentUploads.ejs",{files:false});
        }else {
          res.render('./student/studentUploads.ejs',{files:files})
        }
      })
  })
  // res.render("./student/studentUploads.ejs");
})



// @route POST /upload
// @desc Uploads file to DB    ,upload.single('file')
router.post('/student/uploads/pdf',upload.single('file'),function(req,res){
  // res.json({file: req.file});
  if (req.body.fc=='E') {
    Students.findByIdAndUpdate(req.user.username,{EFee_pdf:true},{overwrite:false},function(err, updatedItem){
       if(err){
         console.log("updating error",err);
       }
       else{
         console.log("Tfee:",updatedItem.TFee_pdf);
         console.log("Efee:",updatedItem.EFee_pdf);
       }
     })
  } else if(req.body.fc=='T') {
    Students.findByIdAndUpdate(req.user.username,{TFee_pdf:true},{overwrite:false},function(err, updatedItem){
       if(err){
         console.log("updating error",err);
       }
       else{
         console.log("Tfee:",updatedItem.TFee_pdf);
         console.log("Efee:",updatedItem.EFee_pdf);
       }
     })
  }

  res.redirect("/student/uploads/pdf");
}
);




// @route GET /pdf/:filename
// @desc Distplay all files in JSON
router.get('/student/file/:filename',function(req,res){
  gfs.files.findOne({filename: req.params.filename},function(err,file){
    // Check if file exists
    if (!file||file.length ===0) {
      return res.status(404).json({
        err:'No file exists'
      });
    }else {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  })
})


// @route DELETE /files/:id
// @desc delete file
router.delete('/student/file/:id',function(req,res){

  //Changing the database of deleted file
  if (('E'+req.user.username+'.pdf')==req.body.filename) {
    Students.findByIdAndUpdate(req.user.username,{EFee_pdf:false},{overwrite:false},function(err, updatedItem){
       if(err){
         console.log("updating error",err);
       }
     })
  }else if (('T'+req.user.username+'.pdf')==req.body.filename) {
    Students.findByIdAndUpdate(req.user.username,{TFee_pdf:false},{overwrite:false},function(err, updatedItem){
       if(err){
         console.log("updating error",err);
       }
     })
  }

  gfs.remove({_id:req.params.id, root:'uploads'}, function (err, gridStore) {
  if (err) return handleError(err);
  console.log('success');
  res.redirect('/student/uploads/pdf');
});
});

//=========================================================
//=============== checkType function======================
//=========================================================
//checking if file is pdf or not
function checkType(req,res,next) {
  // console.log(req.query.abc);
  // if (req.body.file.type==='application/pdf') {
  //   console.log("it is pdf");
    return next();
  // } else {
  //   res.send("Only pdf is accepted.")
  // }
}
module.exports = router;
