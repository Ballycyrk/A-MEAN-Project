var mongoose      = require('mongoose');
// var bcrypt        = require('bcrypt-nodejs');
var Schema        = mongoose.Schema;

var FriendshipSchema = new Schema({
  confirmed       : {type: Boolean, default: false},
  his             : {
    username      : { type: Schema.Types.ObjectId, ref: 'User'}
  },
  her             : {
    username      : { type: Schema.Types.ObjectId, ref: 'User'}
  }
});


mongoose.model('Friendship', FriendshipSchema)
