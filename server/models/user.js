var mongoose      = require('mongoose');
var bcrypt        = require('bcrypt-nodejs');
var Schema        = mongoose.Schema;

var UserSchema    = new Schema({
  username        : {type: String },
  online          : {type: Boolean},
  email           : { type: String },
  local           : {
    email         : { type: String },
    password      : { type: String }
  },
  facebook        : {
    id            : { type: String },
    token         : { type: String },
    email         : { type: String },
    name          : { type: String }
  },
  google          : {
    id            : { type: String },
    token         : { type: String },
    email         : { type: String },
    name          : { type: String }
  }
});

// methods =========================
// generating a hash
UserSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checking if a password is valid
UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
}

mongoose.model('User', UserSchema)
