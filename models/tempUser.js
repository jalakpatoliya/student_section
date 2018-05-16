var mongoose               = require("mongoose");

var TempUserSchema = new mongoose.Schema({
    username : String,
    password : String
})

module.exports = mongoose.model("TempUser",TempUserSchema);
