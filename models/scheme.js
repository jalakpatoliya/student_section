var mongoose               = require("mongoose");

var scheme = new mongoose.Schema({
 name:String,
 category:String,
 gender:String,
 income:Number,
 incomeCondition:String,
 marks:Number,
 year:String,
 residency:String
})

module.exports = mongoose.model("scheme",scheme);
