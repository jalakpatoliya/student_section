var   mongoose = require('mongoose'),
      express  = require('express'),
      router   = express.Router();

router.get("/receiptsForm",function (req,res) {
  
  res.render("receiptsForm.ejs")
})



module.exports = router;
