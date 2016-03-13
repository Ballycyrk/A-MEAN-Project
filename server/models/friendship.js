var mongoose      = require('mongoose');
// var bcrypt        = require('bcrypt-nodejs');
var Schema        = mongoose.Schema;

var FriendshipSchema = new Schema({
  confirmed       : {type: Boolean, default: false},
  his             : {
    username      : { type: Object}
  },
  her             : {
    username      : { type: Object}
  }
});


mongoose.model('Friendship', FriendshipSchema)
