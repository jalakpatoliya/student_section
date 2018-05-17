var mongoose               = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({

  username          : String,
  password          : String,
  role              : {
                        type: String,
                        default: "user",
                        enum: ["user", "admin","student"]
                      },
  email               : String,
  resetPasswordToken  : String,
  resetPasswordExpires: Date,
})


UserSchema.plugin(passportLocalMongoose); // plugin connects all the passportLocalMongoose mehtods to UserSchema

module.exports = mongoose.model("User",UserSchema);
